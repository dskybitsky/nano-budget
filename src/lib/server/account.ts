'use server';

import { Account } from '@prisma/client';
import prisma from '@/lib/prismadb';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';

const ACCOUNT_CACHE_TAG = 'account';
const ACCOUNT_CACHE_RETENTION = 3600;

export const getAccount = cache(
  async (id: string): Promise<Account | null> => prisma.account.findFirst({ where: { id } }),
  ['get-account'],
  { revalidate: ACCOUNT_CACHE_RETENTION, tags: [ACCOUNT_CACHE_TAG] },
);

export const getAccounts = cache(
  async (): Promise<Account[]> => prisma.account.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
  ['get-accounts'],
  { revalidate: ACCOUNT_CACHE_RETENTION, tags: [ACCOUNT_CACHE_TAG] },
);

export const createAccount = async (data: Omit<Account, 'id'>) => {
  const account = await prisma.account.create({ data });

  revalidateTag(ACCOUNT_CACHE_TAG);

  return account;
};

export const updateAccount = async (id: string, data: Partial<Omit<Account, 'id'>>) => {
  return prisma.account.update({ where: { id }, data }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const deleteAccount = async (id: string) => {
  return prisma.account.delete({ where: { id } }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

