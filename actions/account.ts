'use server';

import prisma from '@/lib/prismadb';
import { Account } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';

const ACCOUNT_CACHE_TAG = 'account';
const ACCOUNT_CACHE_RETENTION = 3600;

export const getAccount = cache(
    (id: string): Promise<Account | null> => prisma.account.findFirst({ where: { id } }),
    ['get-account'],
    { revalidate: ACCOUNT_CACHE_RETENTION, tags: [ACCOUNT_CACHE_TAG] },
);

export const getAccounts = cache(
    (): Promise<Account[]> => prisma.account.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
    ['get-accounts'],
    { revalidate: ACCOUNT_CACHE_RETENTION, tags: [ACCOUNT_CACHE_TAG] },
);

export const createAccount = async (data: Omit<Account, 'id'>) => {
    return prisma.account.create({ data }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const updateAccount = async (id: string, data: Partial<Omit<Account, 'id'>>) => {
    return prisma.account.update({ where: { id }, data }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const deleteAccount = async (id: string) => {
    return prisma.account.delete({ where: { id } }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};
