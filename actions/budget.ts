'use server';

import prisma from '@/lib/prismadb';
import { Budget } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';

const BUDGET_CACHE_TAG = 'budget';
const BUDGET_CACHE_RETENTION = 3600;

export const getPeriodBudget = cache(
    (periodId: string): Promise<Budget[]> => prisma.budget.findMany({ where: { periodId } }),
    ['get-period-budget'],
    { revalidate: BUDGET_CACHE_RETENTION, tags: [BUDGET_CACHE_TAG] },
);

export const setBudget = async (data: Omit<Budget, 'id'>): Promise<void> => {
    await prisma.budget
        .upsert({
            create: data,
            update: { value: data.value },
            where: {
                periodCategoryId: {
                    periodId: data.periodId,
                    categoryId: data.categoryId,
                },
            },
        })
        .then(() => revalidateTag(BUDGET_CACHE_TAG));
};
