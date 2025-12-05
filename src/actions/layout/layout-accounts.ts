'use server';

import { Account, Period } from '@prisma/client';
import { getTransactions, getTransactionsCount } from '@/lib/server/transaction';
import { getAccounts } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';
import { getCategories } from '@/lib/server/category';
import { getLastPeriod, getPeriod } from '@/lib/server/period';
import { ActualExpected } from '@/lib/types';
import { calculateAccountBalance } from '@/lib/account';

export type LayoutAccountsDto = {
  accounts: Account[],
  currentAccount?: Account & {
    balance: ActualExpected,
    transactionsCount?: {
      all: number,
      periodic?: number,
      pending: number,
    },
  },
};

export const layoutAccounts = async (
  accountId?: string,
  periodId?: string,
): Promise<LayoutAccountsDto> => {
  await getSessionUser();

  const accounts = await getAccounts();

  const currentAccount = accountId ? accounts.find(a => a.id === accountId): undefined;

  if (!currentAccount) {
    return { accounts };
  }

  const categoryIdList = (await getCategories(currentAccount.id)).map(c => c.id);

  const [transactions, transactionsCountAll, transactionsCountPending] = await Promise.all([
    getTransactions({ categoryIdList }),
    getTransactionsCount({ categoryIdList }),
    getTransactionsCount({ categoryIdList, executed: false }),
  ]);

  const balance = calculateAccountBalance(transactions, currentAccount);

  const period = await findPeriod(currentAccount.id, periodId);

  if (!period) {
    return {
      accounts,
      currentAccount: { ...currentAccount, balance, transactionsCount: {
        all: transactionsCountAll,
        pending: transactionsCountPending,
      } },
    };
  }

  const transactionsCountPeriodic = await getTransactionsCount({
    categoryIdList,
    executed: true,
    createdFrom: period.started,
    createdTo: period.ended ?? undefined,
  });

  return {
    accounts,
    currentAccount: { ...currentAccount, balance, transactionsCount: {
      all: transactionsCountAll,
      pending: transactionsCountPending,
      periodic: transactionsCountPeriodic,
    } },
  };
};

async function findPeriod(
  accountId: string,
  periodId?: string,
): Promise<Period | null> {
  if (!periodId) {
    return getLastPeriod(accountId);
  }

  const period = await getPeriod(periodId);

  if (period?.accountId !== accountId) {
    return getPeriod(accountId);
  }

  return period;
}

