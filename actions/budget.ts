'use server';

import prisma from '@/lib/prismadb';
import { Budget } from '@prisma/client';
import { cache, invalidate, Store } from '@/lib/cache';

const periodBudgetStore: Store<Budget[]> = new Map<string, Budget[]>();

export const getPeriodBudget = async (periodId: string): Promise<Budget[]> => {
    return cache(
        periodBudgetStore,
        () =>
            prisma.budget.findMany({
                where: { periodId },
            }),
        periodId,
    );
};

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
        .then((result) => invalidate(periodBudgetStore, result.periodId));
};
