'use server';

import { Account, AccountType, OperationType, Period, Transaction } from '@prisma/client';
import { getTransactions } from '@/lib/server/transaction';
import { getAccounts } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';
import { Total } from '@/lib/types';
import { getCategories } from '@/lib/server/category';
import { getPeriods } from '@/lib/server/period';

export type AccountLayoutDto = {
  accounts: AccountDto[],
};

type AccountDto = Account & {
  balance: Total,
  summary: {
    [periodId: string] : AccountSummaryDto,
    last: AccountSummaryDto
  },
};

type AccountSummaryDto = {
  count: number,
  executedCount: number,
  nonExecutedCount: number,
};

export const accountLayout = async (): Promise<AccountLayoutDto> => {
  await getSessionUser();

  const accounts = await getAccounts();

  const accountTransactions = await Promise.all(
    accounts.map(async (a) => {
      const categoryIdList = (await getCategories(a.id))
        .map(c => c.id);

      return getTransactions({ categoryIdList });
    }),
  );

  const accountPeriods = await Promise.all(
    accounts.map(async (a) => getPeriods(a.id)),
  );

  const accountDtoList = accounts.map((account, index) => ({
    ...account,
    balance: calculateBalance(accountTransactions[index], account),
    summary: calculateSummary(accountTransactions[index], accountPeriods[index] ?? null),
  }));

  return { accounts: accountDtoList };
};

const calculateBalance = (
  transactions: Transaction[],
  account: Account,
): AccountDto['balance'] => {
  let actual = 0;
  let expected = 0;

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

const calculateSummary = (
  transactions: Transaction[],
  periods: Period[],
): AccountDto['summary'] => {
  const inPeriod = (transaction: Transaction, period: Period) => (
    transaction.created >= period.started
      && (!period.ended || transaction.created <= period.ended)
  );

  const summary = periods.reduce((carry, period) => {
    carry[period.id] = {
      count: 0,
      executedCount: 0,
      nonExecutedCount: 0,
    };

    return carry;
  }, { last: { count: 0, executedCount: 0, nonExecutedCount: 0 } } as AccountDto['summary']);

  transactions.forEach((transaction) => {
    const period = periods.find(p => inPeriod(transaction, p));

    if (period) {
      if (transaction.executed) {
        summary[period.id].executedCount += 1;
      } else {
        summary[period.id].nonExecutedCount += 1;
      }

      summary[period.id].count += 1;

      if (period === periods[periods.length - 1]) {
        summary.last = summary[period.id];
      }
    }
  });

  return summary;
};


