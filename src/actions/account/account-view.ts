'use server';

import { Account, Category, Period } from '@prisma/client';
import { getAccount } from '@/lib/model/account';
import { getCategories } from '@/lib/model/category';
import { getPeriods } from '@/lib/model/period';
import { getSessionUser } from '@/lib/auth';

export interface AccountViewDto {
  account: Account;
  periods: Period[];
  categories: Category[];
}

export const accountView = async (id: string): Promise<AccountViewDto | null> => {
  await getSessionUser();

  const account = await getAccount(id);

  if (!account) {
    return null;
  }

  const [periods, categories] = await Promise.all([getPeriods(id), getCategories(id)]);

  return { account, periods, categories };
};
