'use server';

import { Account } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { getAccounts } from '@/lib/server/account';

export type AccountsIndexDto = {
  accounts: Account[];
};


export const accountsIndex = async (): Promise<AccountsIndexDto> => {
  await getSessionUser();

  const accounts = await getAccounts();

  return { accounts };
};
