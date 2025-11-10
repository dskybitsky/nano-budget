import { OperationType, Transaction } from '@prisma/client';
import { Total } from '@/lib/types';

export type TransactionFilter = {
  createdFrom?: Date;
  createdTo?: Date
};

export const getTransactionsTotal = (transactions: Transaction[]): Total => {
  let actual = 0;
  let expected = 0;

  transactions.forEach((transaction) => {
    const sign = transaction.type === OperationType.credit ? -1 : 1;

    if (transaction.executed) {
      actual += sign * transaction.value;
    }

    expected += sign * transaction.value;
  });

  return { actual, expected };
};
