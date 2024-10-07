'use server';

import prisma from '@/lib/prismadb';
import { Transaction } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';
import { getCategories } from '@/lib/model/category';

const TRANSACTION_CACHE_TAG = 'transaction';
const TRANSACTION_CACHE_RETENTION = 3600;

export type TransactionFilter = {
  createdFrom?: Date;
  createdTo?: Date
};

export const getAccountTransactions = async (
  accountId: string,
  filter?: TransactionFilter,
): Promise<Transaction[]> => {
  const categories = await getCategories(accountId);

  return getTransactions(categories.map(c => c.id), filter);
};

export const getTransactions = cache(
  async (categoriesIdList: string[], filter?: TransactionFilter): Promise<Transaction[]> => {
    const { createdFrom, createdTo } = filter ?? {};

    return prisma.transaction.findMany({
      where: {
        categoryId: { in: categoriesIdList },
        AND: [
          ...(createdFrom ? [{ created: { gte: createdFrom } }] : []),
          ...(createdTo ? [{ created: { lte: createdTo } }] : []),
        ],
      },
      orderBy: { created: 'desc' },
    });
  },
  ['get-transactions'],
  { revalidate: TRANSACTION_CACHE_RETENTION, tags: [TRANSACTION_CACHE_TAG] },
);

export async function createTransaction(data: Omit<Transaction, 'id'>) {
  return prisma.transaction.create({ data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
}

export async function updateTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>) {
  return prisma.transaction.update({ where: { id }, data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({ where: { id } }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
}
