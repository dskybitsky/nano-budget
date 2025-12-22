'use server';

import { Budget } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { setBudget } from '@/lib/server/budget';

export type BudgetSetDto = Omit<Budget, 'categoryId' | 'periodId' >;

export const budgetSet = async (categoryId: string, periodId: string, dto: BudgetSetDto): Promise<void> => {
  await getSessionUser();

  return setBudget({ categoryId, periodId, ...dto });
};
