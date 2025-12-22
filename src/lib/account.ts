import { Account, AccountType, OperationType, Period, Transaction } from '@prisma/client';
import { ActualExpected } from '@/lib/types';
import { isTransactionInPeriod } from '@/lib/transaction';

export const calculateAccountBalance = (
  transactions: Transaction[],
  account: Account,
): ActualExpected => {
  let actual = account.value;
  let expected = account.value;

  const accountSign = account.type == AccountType.credit ? -1 : 1;

  transactions.forEach((transaction) => {
    const sign = transaction.type === OperationType.credit ? -1 : 1;

    if (transaction.executed) {
      actual += accountSign * sign * transaction.value;
    }

    expected += accountSign * sign * transaction.value;
  });

  return { actual, expected };
};

export const calculateAccountTransactionsCount = (
  transactions: Transaction[],
  periods: Period[],
): Map<Period['id'], ActualExpected> => {
  const result: Map<Period['id'], ActualExpected> = new Map();

  periods.forEach((period) => {
    result.set(period.id, { actual: 0, expected: 0 });
  });

  transactions.forEach((transaction) => {
    const period = periods.find(p => isTransactionInPeriod(transaction, p));

    if (period) {
      if (transaction.executed) {
        result.get(period.id)!.actual += 1;
      }

      result.get(period.id)!.expected += 1;
    }
  });

  return result;
};
