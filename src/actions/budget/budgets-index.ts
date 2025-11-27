'use server';

import { Account, AccountType, Category, OperationType, Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getBudgets } from '@/lib/server/budget';
import { getTransactionsWithCategory } from '@/lib/server/transaction';
import { PlannedTotal } from '@/lib/types';
import _ from 'lodash';
import { calculateTransactionsTotal } from '@/lib/transaction';

export type BudgetsIndexDto = {
  account: Account,
  categories: Category[],
  periods: Period[],
  periodId: string,
  periodBudgetsByCategory: { [p: Category['id']] : PlannedTotal },
  periodTotal: PlannedTotal,
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

  const accountSign = account.type == AccountType.credit ? -1 : 1;

  const transactionsIndex = _.groupBy(transactions, 'categoryId');

  const budgetsByCategory = categories.reduce((acc, category) => {
    const transactionsTotal = calculateTransactionsTotal(transactionsIndex[category.id] ?? []);

    acc[category.id] = {
      planned: accountSign * (budgetsIndex[category.id]?.value ?? 0),
      actual: accountSign * transactionsTotal.actual,
      expected: accountSign * transactionsTotal.expected,
    };

    return acc;
  }, {} as { [p: Category['id']] : PlannedTotal });

  const total = categories.reduce(
    (acc, category) => {
      const sign = category.type === OperationType.credit ? -1 : 1;

      acc.planned += accountSign * sign * (budgetsByCategory[category.id]?.planned ?? 0);
      acc.actual += accountSign * sign * (budgetsByCategory[category.id]?.actual ?? 0);
      acc.expected += accountSign * sign * (budgetsByCategory[category.id]?.expected ?? 0);

      return acc;
    },
    { planned: 0, actual: 0, expected: 0 },
  );

  return {
    account,
    categories,
    periods,
    periodId: period.id,
    periodBudgetsByCategory: budgetsByCategory,
    periodTotal: total,
  };
};

