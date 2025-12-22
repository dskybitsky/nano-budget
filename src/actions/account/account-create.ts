'use server';

import { Account } from '@prisma/client';
import { createAccount } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';

export type AccountCreateDto = Omit<Account, 'id'>;

export const accountCreate = async (dto: AccountCreateDto): Promise<Account> => {
  await getSessionUser();

  return createAccount(dto);
};
