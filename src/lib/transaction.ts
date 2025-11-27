import { Category, Transaction } from '@prisma/client';
import { Total } from '@/lib/types';

export const calculateTransactionsTotal = (transactions: (Transaction & { category: Category })[]): Total => {
  let actual = 0;
  let expected = 0;

  transactions.forEach((transaction) => {
    const sign = transaction.type === transaction.category.type ? 1 : -1;

    if (transaction.executed) {
      actual += sign * transaction.value;
    }

    expected += sign * transaction.value;
  });

  return { actual, expected };
};
