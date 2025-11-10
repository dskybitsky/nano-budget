'use server';

import { Account, Category, Period, Transaction } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getPeriods } from '@/lib/server/period';
import { getCategories } from '@/lib/server/category';
import { getAccountTransactions } from '@/lib/server/transaction';
import { TransactionFilter } from '@/lib/transaction';

export type TransactionsIndexDto = {
  account: Account;
  categories: Category[];
  periods: Period[];
  transactions: Transaction[];
};


export const transactionsIndex = async (
  accountId: string,
  filter?: TransactionFilter,
): Promise<TransactionsIndexDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const [categories, periods] = await Promise.all([
    getCategories(accountId),
    getPeriods(accountId),
  ]);

  const transactions = await getAccountTransactions(accountId, filter);

  return { account, categories, periods, transactions };
};
