'use server';

import { Account } from '@prisma/client';
import { getAccountTransactions } from '@/lib/server/transaction';
import { getAccounts } from '@/lib/server/account';
import { getAccountBalance } from '@/lib/account';
import { getSessionUser } from '@/lib/auth';
import { Total } from '@/lib/types';

export type AccountLayoutDto = {
  accounts: AccountDto[];
};

type AccountDto = Account & { balance: Total };

export const accountLayout = async (): Promise<AccountLayoutDto> => {
  await getSessionUser();

  const accounts = await getAccounts();

  const accountTransactions = await Promise.all(
    accounts.map((a) => getAccountTransactions(a.id)),
  );

  const accountDtoList = accounts.map((account, index) => ({
    ...account,
    balance: getAccountBalance(account, accountTransactions[index]),
  }));

  return { accounts: accountDtoList };
};
