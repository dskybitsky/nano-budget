'use server';

import { Account, Category } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getCategories } from '@/lib/server/category';
import { getTransactionsWithCategory, TransactionWithCategory } from '@/lib/server/transaction';

export type TransactionsIndexPendingDto = {
  account: Account;
  categories: Category[];
  transactions: TransactionWithCategory[];
};

export const transactionsIndexPending = async (
  accountId: string,
): Promise<TransactionsIndexPendingDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const categories = await getCategories(accountId);

  const transactions = await getTransactionsWithCategory({
    categoryIdList: categories.map(c => c.id),
    executed: false,
  });

  return {
    account,
    categories,
    transactions,
  };
};
