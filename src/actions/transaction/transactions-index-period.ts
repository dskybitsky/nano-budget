'use server';

import { Account, Category, Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getTransactionsWithCategory, TransactionWithCategory } from '@/lib/server/transaction';

export type TransactionsIndexPeriodDto = {
  account: Account;
  categories: Category[];
  periods: Period[];
  period: Period,
  transactions: TransactionWithCategory[];
};

export const transactionsIndexPeriod = async (
  accountId: string,
  periodId?: string,
): Promise<TransactionsIndexPeriodDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const period = await (periodId ? getPeriod(periodId) : getLastPeriod(accountId));

  if (!period || period.accountId !== accountId) {
    return null;
  }

  const [categories, periods] = await Promise.all([
    getCategories(accountId),
    getPeriods(accountId),
  ]);

  const transactions = await getTransactionsWithCategory({
    categoryIdList: categories.map(c => c.id),
    createdFrom: period.started,
    createdTo: period.ended ?? undefined,
  });

  return {
    account,
    categories,
    periods,
    period,
    transactions,
  };
};
