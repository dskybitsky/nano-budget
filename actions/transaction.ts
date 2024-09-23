'use server';

import prisma from '@/lib/prismadb';
import { Category, Transaction } from '@prisma/client';
import { getAccountCategories } from '@/actions/category';

export const getAccountTransactions = async (
    accountId: string,
    dateFrom: Date | null = null,
    dateTo: Date | null = null,
): Promise<(Transaction & { category: Category })[]> => {
    const categories = await getAccountCategories(accountId);

    const categoriesIdList = categories.map((c) => c.id);

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
};

export const createTransaction = async (data: Omit<Transaction, 'id'>) => {
    return prisma.transaction.create({ data });
};

export const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    return prisma.transaction.update({ where: { id }, data });
};

export const deleteTransaction = async (id: string) => {
    return prisma.transaction.delete({ where: { id } });
};
