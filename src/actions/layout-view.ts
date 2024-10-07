'use server';

import { Account } from '@prisma/client';
import { getAccountTransactions } from '@/lib/model/transaction';
import { WithBalance } from '@/types';
import { getAccounts } from '@/lib/model/account';
import { getSessionUser } from '@/lib/auth';
import { calculateAccountBalance } from '@/lib/model/utils';

export interface LayoutViewDto {
  accounts: WithBalance<Account>[];
  accountsById: Record<string, WithBalance<Account>>;
}

export const layoutView = async (): Promise<LayoutViewDto> => {
  await getSessionUser();

  const accounts = (await getAccounts());
  const accountsTransactions = await Promise.all(
    accounts.map((a) => getAccountTransactions(a.id)),
  );

  const accountsWithBalance = accounts
    .map((account, index) => ({
      ...account,
      balance: calculateAccountBalance(account, accountsTransactions[index]),
    }));

  const accountsWithBalanceById = accountsWithBalance
    .reduce((acc, account) => ({ ...acc, [account.id]: account }), {});

  return {
    accounts: accountsWithBalance,
    accountsById: accountsWithBalanceById,
  };
};
