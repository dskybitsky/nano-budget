'use server';

import { Transaction } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { createTransaction } from '@/lib/model/transaction';

export type TransactionCreateDto = Omit<Transaction, 'id'>;

export const transactionCreate = async (dto: TransactionCreateDto): Promise<void> => {
  await getSessionUser();

  return createTransaction(dto);
};
