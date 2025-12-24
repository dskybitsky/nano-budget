'use server';

import { Account, Category, Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getBudgets } from '@/lib/server/budget';
import { getTransactionsWithCategory } from '@/lib/server/transaction';
import { ActualExpectedPlanned } from '@/lib/types';
import _ from 'lodash';
import { calculateTransactionsTotal } from '@/lib/transaction';
import { calculateBudgetValue } from '@/lib/budget';

export type BudgetsIndexDto = {
  account: Account,
  categories: Category[],
  periods: Period[],
  periodId: string,
  periodBudgetsByCategory: { [p: Category['id']] : ActualExpectedPlanned },
  periodTotal: ActualExpectedPlanned,
};

export const budgetsIndex = async (
  accountId: string,
  periodId?: string,
): Promise<BudgetsIndexDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const period = await (periodId ? getPeriod(periodId) : getLastPeriod(accountId));

  if (!period || period.accountId !== accountId) {
    return null;
  }

  const [categories, periods, budgets] = await Promise.all([
    getCategories(period.accountId),
    getPeriods(period.accountId),
    getBudgets(period.id),
  ]);

  const budgetsIndex = _.keyBy(budgets, 'categoryId');

  const categoryIdList = categories.map((category) => category.id);

  const transactions = await getTransactionsWithCategory({
    categoryIdList,
    createdFrom: period.started,
    createdTo: period.ended ?? undefined,
  });

  const transactionsIndex = _.groupBy(transactions, 'categoryId');

  const total = { planned: 0, actual: 0, expected: 0, rest: 0 };

  const budgetsByCategory = categories.reduce((acc, category) => {
    const planned = calculateBudgetValue(
      budgetsIndex[category.id] ?? { value: 0 },
      category.type,
      account.type,
    );

    const transactionsTotal = calculateTransactionsTotal(
      transactionsIndex[category.id] ?? [],
      account.type,
    );

    acc[category.id] = {
      planned: Math.abs(planned),
      actual: Math.abs(transactionsTotal.actual),
      expected: Math.abs(transactionsTotal.expected),
      rest: Math.abs(planned) - Math.abs(transactionsTotal.expected),
    };

    total.planned += planned;
    total.actual += transactionsTotal.actual;
    total.expected += transactionsTotal.expected;
    total.rest += acc[category.id].rest;

    return acc;
  }, {} as { [p: Category['id']] : ActualExpectedPlanned });

  return {
    account,
    categories,
    periods,
    periodId: period.id,
    periodBudgetsByCategory: budgetsByCategory,
    periodTotal: total,
  };
};

