'use server';

import { Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { updatePeriod } from '@/lib/model/period';

export type PeriodUpdateDto = Partial<Omit<Period, 'id'>>;

export const periodUpdate = async (id: string, dto: PeriodUpdateDto): Promise<void> => {
  await getSessionUser();

  return updatePeriod(id, dto);
};
