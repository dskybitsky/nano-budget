'use server';

import { Category } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { createCategory } from '@/lib/model/category';

export type CategoryCreateDto = Omit<Category, 'id'>;

export const categoryCreate = async (dto: CategoryCreateDto): Promise<void> => {
  await getSessionUser();

  return createCategory(dto);
};
