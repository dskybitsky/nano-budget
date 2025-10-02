'use server';

import { Account, AccountType, Transaction } from '@prisma/client';
import prisma from '@/lib/prismadb';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';
import { Balance } from '@/lib/model/types';
import { getTransactionsTotal } from '@/lib/model/transaction';
import { monetaryEqual, monetaryRound } from '@/lib/utils';

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
  return prisma.account.create({ data }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const updateAccount = async (id: string, data: Partial<Omit<Account, 'id'>>) => {
  return prisma.account.update({ where: { id }, data }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const deleteAccount = async (id: string) => {
  return prisma.account.delete({ where: { id } }).then(() => revalidateTag(ACCOUNT_CACHE_TAG));
};

export const getAccountBalance = async (account: Account, transactions: Transaction[]): Promise<Balance> => {
  const accountSign = account.type == AccountType.credit ? -1 : 1;

  const total = await getTransactionsTotal(transactions);

  const actual = monetaryRound(account.value + accountSign * total.actual);
  const expected = monetaryRound(account.value + accountSign * (total.expected ?? total.actual));

  return {
    actual,
    expected: monetaryEqual(actual, expected) ? undefined : expected,
  };
};

