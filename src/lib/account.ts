import { Account, Transaction } from '@prisma/client';
import { ActualExpected } from '@/lib/types';
import { calculateTransactionsTotal } from '@/lib/transaction';

export const calculateAccountBalance = (
  transactions: Transaction[],
  account: Account,
): ActualExpected => {
  const transactionsTotal = calculateTransactionsTotal(transactions, account.type);

  return {
    actual: account.opening + transactionsTotal.actual,
    expected: account.opening + transactionsTotal.expected,
  };
};
