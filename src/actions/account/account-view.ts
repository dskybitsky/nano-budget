'use server';

import { Account, Category, Period } from '@prisma/client';
import { getAccount } from '@/lib/server/account';
import { getCategories } from '@/lib/server/category';
import { getPeriods } from '@/lib/server/period';
import { getSessionUser } from '@/lib/auth';

export type AccountViewDto = {
  account: Account;
  periods: Period[];
  categories: Category[];
};

export const accountView = async (id: string): Promise<AccountViewDto | null> => {
  await getSessionUser();

  const account = await getAccount(id);

  if (!account) {
    return null;
  }

  const [periods, categories] = await Promise.all([getPeriods(id), getCategories(id)]);

  return { account, periods, categories };
};
