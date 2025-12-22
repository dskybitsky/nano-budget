'use server';

import { Transaction } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { updateTransaction } from '@/lib/server/transaction';

export type TransactionUpdateDto = Partial<Omit<Transaction, 'id'>>;

export const transactionUpdate = async (id: string, dto: TransactionUpdateDto): Promise<void> => {
  await getSessionUser();

  return updateTransaction(id, dto);
};
