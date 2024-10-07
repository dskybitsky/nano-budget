import { Account, AccountType, OperationType, Transaction } from '@prisma/client';
import { Total } from '@/types';

export const calculateAccountBalance = (account: Account, transactions: Transaction[]): Total => {
  const accountSign = account.type == AccountType.credit ? -1 : 1;

  const total = calculateTransactionsTotal(transactions);

  return {
    expected: account.value + accountSign * total.expected,
    actual: account.value + accountSign * total.actual,
  };
};

export const calculateTransactionsTotal = (transactions: Transaction[]): Total => {
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
