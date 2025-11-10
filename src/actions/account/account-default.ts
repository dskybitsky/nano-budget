'use server';

import { Account } from '@prisma/client';
import { getAccounts } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';

export type AccountDefaultDto = Account;

export const accountDefault = async (): Promise<AccountDefaultDto | null> => {
  await getSessionUser();

  const accounts = await getAccounts();

  return accounts[0] ?? null;
};
