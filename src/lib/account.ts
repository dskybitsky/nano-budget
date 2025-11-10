import { Account, AccountType, Transaction } from '@prisma/client';
import { getTransactionsTotal } from '@/lib/transaction';
import { Total } from '@/lib/types';

export const getAccountBalance = (account: Account, transactions: Transaction[]): Total => {
  const accountSign = account.type == AccountType.credit ? -1 : 1;

  const total = getTransactionsTotal(transactions);

  const actual = account.value + accountSign * total.actual;
  const expected = account.value + accountSign * total.expected;

  return { actual, expected };
};

