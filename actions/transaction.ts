'use server';

import prisma from '@/lib/prismadb';
import { Category, Transaction } from '@prisma/client';
import { getAccountCategories, getCategory } from '@/actions/category';
import { cache, invalidate, Store } from '@/lib/cache';

const accountTransactionsStore: Store<Store<(Transaction & { category: Category })[]>> = new Map<
    string,
    Store<(Transaction & { category: Category })[]>
>();

export const getAccountTransactions = async (
    accountId: string,
    dateFrom: Date | null = null,
    dateTo: Date | null = null,
): Promise<(Transaction & { category: Category })[]> => {
    const categories = await getAccountCategories(accountId);

    const categoriesIdList = categories.map((c) => c.id).sort();

    const cacheKeyL2 = `${categoriesIdList.join('|')}:${dateFrom?.getTime() ?? '-'}:${dateTo?.getTime() ?? '-'}`;

    return cache<(Transaction & { category: Category })[]>(
        accountTransactionsStore,
        () =>
            prisma.transaction.findMany({
                where: {
                    categoryId: { in: categoriesIdList },
                    AND: [
                        ...(dateFrom
                            ? [
                                  {
                                      OR: [
                                          { executed: { gte: dateFrom } },
                                          { executed: null, created: { gte: dateFrom } },
                                      ],
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
            }),
        accountId,
        cacheKeyL2,
    );
};

export const createTransaction = async (data: Omit<Transaction, 'id'>) => {
    return prisma.transaction.create({ data }).then(({ categoryId }) => invalidateCategory(categoryId));
};

export const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    return prisma.transaction.update({ where: { id }, data }).then(({ categoryId }) => invalidateCategory(categoryId));
};

export const deleteTransaction = async (id: string) => {
    return prisma.transaction.delete({ where: { id } }).then(({ categoryId }) => invalidateCategory(categoryId));
};

const invalidateCategory = async (categoryId: string) => {
    const category = await getCategory(categoryId);

    if (category) {
        invalidate(accountTransactionsStore, category.accountId);
    }
};
