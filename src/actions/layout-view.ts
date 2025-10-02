'use server';

import { Account } from '@prisma/client';
import { getAccountTransactions } from '@/lib/model/transaction';
import { getAccountBalance, getAccounts } from '@/lib/model/account';
import { getSessionUser } from '@/lib/auth';
import { Balance } from '@/lib/model/types';

type AccountWithBalance = Account & { balance: Balance };

export interface LayoutViewDto {
  accounts: AccountWithBalance[];
  accountsIndex: Record<string, AccountWithBalance>;
}

export const layoutView = async (): Promise<LayoutViewDto> => {
  await getSessionUser();

  const accounts = await getAccounts();

  const accountsTransactions = await Promise.all(
    accounts.map((a) => getAccountTransactions(a.id)),
  );

  const accountBalances = await Promise.all(
    accounts.map((a, index) => getAccountBalance(a, accountsTransactions[index])),
  );

  const accountsWithBalance = accounts
    .map((account, index) => ({
      ...account,
      balance: accountBalances[index],
    }));

  const accountsWithBalanceIndex = accountsWithBalance
    .reduce((acc, account) => ({ ...acc, [account.id]: account }), {});

  return {
    accounts: accountsWithBalance,
    accountsIndex: accountsWithBalanceIndex,
  };
};
