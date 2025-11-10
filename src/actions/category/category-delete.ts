'use server';

import { getSessionUser } from '@/lib/auth';
import { deleteCategory } from '@/lib/server/category';

export const categoryDelete = async (id: string): Promise<void> => {
  await getSessionUser();

  return deleteCategory(id);
};
