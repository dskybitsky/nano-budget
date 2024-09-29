'use server';

import prisma from '@/lib/prismadb';
import { Category, Transaction } from '@prisma/client';
import { getAccountCategories } from '@/actions/category';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';

const TRANSACTION_CACHE_TAG = 'transaction';
const TRANSACTION_CACHE_RETENTION = 3600;

export const getAccountTransactions = cache(
    async (
        accountId: string,
        dateFrom: Date | null = null,
        dateTo: Date | null = null,
    ): Promise<(Transaction & { category: Category })[]> => {
        const categories = await getAccountCategories(accountId);

        const categoriesIdList = categories.map((c) => c.id).sort();

        return prisma.transaction.findMany({
            where: {
                categoryId: { in: categoriesIdList },
                AND: [
                    ...(dateFrom
                        ? [
                              {
                                  OR: [{ executed: { gte: dateFrom } }, { executed: null, created: { gte: dateFrom } }],
                              },
                          ]
                        : []),
                    ...(dateTo
                        ? [
                              {
                                  OR: [{ executed: { lte: dateTo } }, { executed: null, created: { lte: dateTo } }],
                              },
                          ]
                        : [{}]),
                ],
            },
            orderBy: { created: 'desc' },
            include: { category: true },
        });
    },
    ['get-account-transactions'],
    { revalidate: TRANSACTION_CACHE_RETENTION, tags: [TRANSACTION_CACHE_TAG] },
);

export const createTransaction = async (data: Omit<Transaction, 'id'>) => {
    return prisma.transaction.create({ data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};

export const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    return prisma.transaction.update({ where: { id }, data }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};

export const deleteTransaction = async (id: string) => {
    return prisma.transaction.delete({ where: { id } }).then(() => revalidateTag(TRANSACTION_CACHE_TAG));
};
