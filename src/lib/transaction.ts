import { Period, Transaction } from '@prisma/client';
import { ActualExpected } from '@/lib/types';
import { TransactionWithCategory } from '@/lib/server/transaction';

export const calculateTransactionsTotal = (transactions: TransactionWithCategory[]): ActualExpected => {
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

export const calculateTransactionsCount = (transactions: Transaction[]): ActualExpected => {
  let actual = 0;
  let expected = 0;

  transactions.forEach((transaction) => {
    if (transaction.executed) {
      actual += 1;
    }

    expected += 1;
  });

  return { actual, expected };
};

export const isTransactionInPeriod = (transaction: Transaction, period: Period) => (
  transaction.created >= period.started
  && (!period.ended || transaction.created <= period.ended)
);
