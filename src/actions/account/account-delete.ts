'use server';

import { deleteAccount } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';

export const accountDelete = async (id: string): Promise<void> => {
  await getSessionUser();

  return deleteAccount(id);
};
