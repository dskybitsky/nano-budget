'use server';

import { Account, Category } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccount } from '@/lib/server/account';
import { getCategories } from '@/lib/server/category';
import { getTransactionsWithCategory, TransactionWithCategory } from '@/lib/server/transaction';

export type TransactionFilterDto = {
  categoryIdList?: string[];
  createdFrom?: Date;
  createdTo?: Date;
  executed?: boolean;
  executedFrom?: Date;
  executedTo?: Date;
};

export type TransactionsIndexAllDto = {
  account: Account;
  categories: Category[];
  transactions: TransactionWithCategory[];
};

export const transactionsIndexAll = async (
  accountId: string,
  filter?: TransactionFilterDto,
): Promise<TransactionsIndexAllDto | null> => {
  await getSessionUser();

  const account = await getAccount(accountId);

  if (!account) {
    return null;
  }

  const categories = await getCategories(accountId);
  const categoriesIdList = categories.map(c => c.id);

  const filterCategoryIdSet = filter?.categoryIdList ? new Set(filter.categoryIdList) : undefined;

  const transactions = await getTransactionsWithCategory({
    categoryIdList: filterCategoryIdSet
      ? categoriesIdList.filter(c => filterCategoryIdSet.has(c))
      : categoriesIdList,
    ...filter,
  });

  return {
    account,
    categories,
    transactions,
  };
};
