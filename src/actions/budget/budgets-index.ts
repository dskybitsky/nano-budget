'use server';

import { Account, Budget, Category, Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/model/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/model/period';
import { getCategories } from '@/lib/model/category';
import { getBudgets } from '@/lib/model/budget';

export type BudgetsIndexDto = {
  account: Account;
  categories: Category[];
  periods: Period[];
  budgets: Budget[];
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

  return { account, categories, periods, budgets };
};
