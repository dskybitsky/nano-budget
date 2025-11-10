'use server';

import { Account, AccountType, Category, OperationType, Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getBudgets } from '@/lib/server/budget';
import { getTransactions } from '@/lib/server/transaction';
import { PlannedTotal } from '@/lib/types';
import { getTransactionsTotal } from '@/lib/transaction';
import _ from 'lodash';

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

  const categoriesIdList = categories.map((category) => category.id);

  const transactions = await getTransactions(categoriesIdList, {
    createdFrom: period.started,
    createdTo: period.ended ?? undefined,
  });

  const transactionsIndex = _.groupBy(transactions, 'categoryId');

  const budgetsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = {
      planned: budgetsIndex[category.id]?.value ?? 0,
      ...getTransactionsTotal(transactionsIndex[category.id] ?? []),
    };

    return acc;
  }, {} as { [p: Category['id']] : PlannedTotal });

  const total = getTransactionsTotal(transactions);

  const accountSign = account.type == AccountType.credit ? -1 : 1;

  const planned = categories.reduce(
    (acc, category) => {
      const sign = category.type === OperationType.credit ? -1 : 1;

      acc += accountSign * sign * (budgetsByCategory[category.id]?.planned ?? 0);

      return acc;
    },
    0,
  );

  return {
    account,
    categories,
    periods,
    periodId: period.id,
    periodBudgetsByCategory: budgetsByCategory,
    periodTotal: { ...total, planned },
  };
};
