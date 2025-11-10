'use server';

import { getSessionUser } from '@/lib/auth';
import { deleteTransaction } from '@/lib/server/transaction';

export const transactionDelete = async (id: string): Promise<void> => {
  await getSessionUser();

  return deleteTransaction(id);
};
