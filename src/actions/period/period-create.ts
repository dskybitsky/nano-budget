'use server';

import { Period } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { createPeriod } from '@/lib/model/period';

export type PeriodCreateDto = Omit<Period, 'id'>;

export const periodCreate = async (dto: PeriodCreateDto): Promise<void> => {
  await getSessionUser();

  return createPeriod(dto);
};
