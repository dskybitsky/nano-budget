'use server';

import { getSessionUser } from '@/lib/auth';
import { deleteTransaction } from '@/lib/model/transaction';

export const transactionDelete = async (id: string): Promise<void> => {
  await getSessionUser();

  return deleteTransaction(id);
};
