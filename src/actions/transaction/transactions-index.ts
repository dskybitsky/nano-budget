'use server';

import { Account, Category, Period, Transaction } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/model/account';
import { getPeriods } from '@/lib/model/period';
import { getCategories } from '@/lib/model/category';
import { getTransactions, TransactionFilter } from '@/lib/model/transaction';

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

  const transactions = await getTransactions(
    categories.map((c) => c.id),
    filter,
  );

  return { account, categories, periods, transactions };
};
