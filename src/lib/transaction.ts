import { AccountType, OperationType, Transaction } from '@prisma/client';
import { ActualExpected } from '@/lib/types';

export const calculateTransactionValue = (transaction: Transaction, accountType: AccountType): number => {
  const accountSign = accountType == AccountType.credit ? -1 : 1;
  const sign = transaction.type == OperationType.credit ? -1 : 1;

  return accountSign * sign * transaction.value;
};

export const calculateTransactionsTotal = (transactions: Transaction[], accountType: AccountType): ActualExpected => {
  let actual = 0;
  let expected = 0;

  transactions.forEach((transaction) => {
    const value = calculateTransactionValue(transaction, accountType);

    if (transaction.executed) {
      actual += value;
    }

    expected += value;
  });

  return { actual, expected };
};
