'use server';

import { Account, Category, Period, Transaction } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getLastPeriod, getPeriod, getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getTransactionsWithCategory } from '@/lib/server/transaction';
import { Total } from '@/lib/types';

export type TransactionFilterDto = {
  executed?: boolean;
  executedFrom?: Date;
  executedTo?: Date;
};

export type TransactionsIndexDto = {
  account: Account;
  categories: Category[];
  periods: Period[];
  periodId: string,
  transactions: Transaction[];
  periodTotal: Total,
};

export const transactionsIndex = async (
  accountId: string,
  periodId?: string,
  filter?: TransactionFilterDto,
): Promise<TransactionsIndexDto | null> => {
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
    ...filter,
  });

  return {
    account,
    categories,
    periods,
    periodId: period.id,
    transactions,
    periodTotal: calculateTotal(transactions),
  };
};

const calculateTotal = (transactions: (Transaction & { category: Category })[]): Total => {
  let actual = 0;
  let expected = 0;

  transactions.forEach((transaction) => {
    const sign = transaction.type === transaction.category.type ? 1 : -1;

    if (transaction.executed) {
      actual += sign * transaction.value;
    }

    expected += sign * transaction.value;
  });

  return { actual, expected };
};
