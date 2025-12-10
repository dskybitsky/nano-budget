'use server';

import { Prisma, Transaction } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/server/cache';
import { prisma } from '@/lib/server/prisma';
import { OffsetCount } from '@/lib/types';

const TRANSACTION_CACHE_TAG = 'transaction';
const TRANSACTION_CACHE_RETENTION = 3600;

export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true }
}>;

export type TransactionsFilter = {
  categoryIdList?: string[];
  createdFrom?: Date;
  createdTo?: Date;
  executed?: boolean;
  executedFrom?: Date;
  executedTo?: Date
};

export const getTransactions = cache(
  async (filter?: TransactionsFilter, offsetCount?: OffsetCount): Promise<Transaction[]> => {
    return prisma.transaction.findMany({
      where: getWhere(filter),
      orderBy: { created: 'desc' },
      skip: offsetCount?.offset ?? 0,
      take: offsetCount?.count,
    });
  },
  ['get-transactions'],
  { revalidate: TRANSACTION_CACHE_RETENTION, tags: [TRANSACTION_CACHE_TAG] },
);

export const getTransactionsWithCategory = cache(
  async (filter?: TransactionsFilter, offsetCount?: OffsetCount): Promise<TransactionWithCategory[]> => {
    return prisma.transaction.findMany({
      where: getWhere(filter),
      orderBy: { created: 'desc' },
      include: { category: true },
      skip: offsetCount?.offset ?? 0,
      take: offsetCount?.count,
    });
  },
  ['get-transactions-with-category'],
  { revalidate: TRANSACTION_CACHE_RETENTION, tags: [TRANSACTION_CACHE_TAG] },
);

export const getTransactionsCount = cache(
  async (filter?: TransactionsFilter): Promise<number> => {
    return prisma.transaction.count({
      where: getWhere(filter),
      orderBy: { created: 'desc' },
    });
  },
  ['get-transactions-count'],
  { revalidate: TRANSACTION_CACHE_RETENTION, tags: [TRANSACTION_CACHE_TAG] },
);

export const createTransaction = async(data: Omit<Transaction, 'id'>) => {
  return prisma.transaction.create({ data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};

export const updateTransaction = async(id: string, data: Partial<Omit<Transaction, 'id'>>) => {
  return prisma.transaction.update({ where: { id }, data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};

export const deleteTransaction = async(id: string) => {
  return prisma.transaction.delete({ where: { id } }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};

const getWhere = (filter?: TransactionsFilter): Prisma.TransactionWhereInput => {
  const {
    categoryIdList,
    createdFrom,
    createdTo,
    executed,
    executedFrom,
    executedTo,
  } = filter ?? {};

  return {
    AND: [
      ...(categoryIdList ? [{ categoryId: { in: categoryIdList } }] : []),
      ...(createdFrom ? [{ created: { gte: createdFrom } }] : []),
      ...(createdTo ? [{ created: { lte: createdTo } }] : []),
      ...(
        executed === true
          ? [{ NOT: { executed: null } }]
          : (executed === false ? [{ executed: null }] : [])
      ),
      ...(executedFrom ? [{ executed: { gte: executedFrom } }] : []),
      ...(executedTo ? [{ executed: { lte: executedTo } }] : []),
    ],
  };
};
