'use server';

import { getSessionUser } from '@/lib/auth';
import { deletePeriod } from '@/lib/server/period';

export const periodDelete = async (id: string): Promise<void> => {
  await getSessionUser();

  return deletePeriod(id);
};
