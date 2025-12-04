'use server';

import { Account, Period } from '@prisma/client';
import { getTransactions } from '@/lib/server/transaction';
import { getAccounts } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';
import { ActualExpected } from '@/lib/types';
import { getCategories } from '@/lib/server/category';
import { getPeriods } from '@/lib/server/period';
import { calculateAccountBalance, calculateAccountTransactionsCount } from '@/lib/account';

export type LayoutAccountsDto = {
  accounts: AccountDto[],
};

type AccountDto = Account & {
  balance: ActualExpected,
  summary: Map<Period['id'], ActualExpected>,
};

export const layoutAccounts = async (): Promise<LayoutAccountsDto> => {
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
    balance: calculateAccountBalance(accountTransactions[index], account),
    summary: calculateAccountTransactionsCount(accountTransactions[index], accountPeriods[index] ?? null),
  }));

  return { accounts: accountDtoList };
};




