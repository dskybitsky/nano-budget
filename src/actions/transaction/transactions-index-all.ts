'use server';

import { Account, Category } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getCategories } from '@/lib/server/category';
import {
  getTransactionsCount,
  getTransactionsWithCategory,
  TransactionsFilter,
  TransactionWithCategory,
} from '@/lib/server/transaction';
import { pageToOffsetCount } from '@/lib/utils';

export type TransactionsIndexAllDto = {
  account: Account;
  categories: Category[];
  transactions: TransactionWithCategory[];
  transactionsCount: number;
  transactionsPerPage: number;
};

export const transactionsIndexAll = async (
  accountId: string,
  filter?: TransactionsFilter,
  page?: number,
): Promise<TransactionsIndexAllDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const categories = await getCategories(accountId);
  const categoriesIdList = categories.map(c => c.id);

  const filterCategoryIdSet = filter?.categoryIdList ? new Set(filter.categoryIdList) : undefined;

  const filterWithCategories = {
    categoryIdList: filterCategoryIdSet
      ? categoriesIdList.filter(c => filterCategoryIdSet.has(c))
      : categoriesIdList,
    ...filter,
  };
  const offsetCount = pageToOffsetCount(page ?? 1, TRANSACTIONS_INDEX_ALL_PAGE_SIZE);

  const [transactions, transactionsCount] = await Promise.all([
    getTransactionsWithCategory(filterWithCategories, offsetCount),
    getTransactionsCount(filterWithCategories),
  ]);

  return {
    account,
    categories,
    transactions,
    transactionsCount,
    transactionsPerPage: TRANSACTIONS_INDEX_ALL_PAGE_SIZE,
  };
};

const TRANSACTIONS_INDEX_ALL_PAGE_SIZE = 30;
