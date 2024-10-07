'use server';

import { Category } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { updateCategory } from '@/lib/model/category';

export type CategoryUpdateDto = Partial<Omit<Category, 'id'>>;

export const categoryUpdate = async (id: string, dto: CategoryUpdateDto): Promise<void> => {
  await getSessionUser();

  return updateCategory(id, dto);
};
