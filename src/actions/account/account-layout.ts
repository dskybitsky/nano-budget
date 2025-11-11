'use server';

import { Account, AccountType, OperationType, Transaction } from '@prisma/client';
import { getTransactions } from '@/lib/server/transaction';
import { getAccounts } from '@/lib/server/account';
import { getSessionUser } from '@/lib/auth';
import { Total } from '@/lib/types';
import { getCategories } from '@/lib/server/category';

export type AccountLayoutDto = {
  accounts: AccountDto[];
};

type AccountDto = Account & { balance: Total };

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

  const accountDtoList = accounts.map((account, index) => ({
    ...account,
    balance: calculateBalance(account, accountTransactions[index]),
  }));

  return { accounts: accountDtoList };
};

const calculateBalance = (
  account: Account,
  transactions: Transaction[],
): Total => {
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
