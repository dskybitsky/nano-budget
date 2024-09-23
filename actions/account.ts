'use server';

import prisma from '@/lib/prismadb';
import { Account, AccountType, CategoryType } from '@prisma/client';
import { getAccountTransactions } from '@/actions/transaction';

export const getAccount = async (id: string): Promise<Account | null> => {
    return prisma.account.findFirst({ where: { id } });
};

export const getAllAccounts = async (): Promise<Account[]> => {
    return prisma.account.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
};

export const getAccountBalance = async (id: string): Promise<{ expected: number; actual: number }> => {
    const account = await getAccount(id);

    if (!account) {
        return { expected: 0, actual: 0 };
    }

    const transactions = await getAccountTransactions(id);

    let actual = account.value;
    let expected = account.value;

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    transactions.forEach((transaction) => {
        const sign = transaction.category.type === CategoryType.credit ? -1 : 1;

        if (transaction.executed) {
            actual += accountSign * sign * transaction.value;
        }
        expected += accountSign * sign * transaction.value;
    });

    return { actual, expected };
};

export const createAccount = async (data: Omit<Account, 'id'>) => {
    return prisma.account.create({ data });
};

export const updateAccount = async (id: string, data: Partial<Omit<Account, 'id'>>) => {
    return prisma.account.update({ where: { id }, data });
};

export const deleteAccount = async (id: string) => {
    return prisma.account.delete({ where: { id } });
};
