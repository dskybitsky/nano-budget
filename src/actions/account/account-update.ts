'use server';

import { Account } from '@prisma/client';
import { updateAccount } from '@/lib/model/account';
import { getSessionUser } from '@/lib/auth';

export type AccountUpdateDto = Partial<Omit<Account, 'id'>>;

export const accountUpdate = async (id: string, dto: AccountUpdateDto): Promise<void> => {
  await getSessionUser();

  return updateAccount(id, dto);
};
