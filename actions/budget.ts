'use server';

import prisma from '@/lib/prismadb';
import { Budget } from '@prisma/client';

export const getPeriodBudget = async (periodId: string): Promise<Budget[]> => {
    return prisma.budget.findMany({
        where: { periodId },
    });
};

export const setBudget = async (data: Omit<Budget, 'id'>): Promise<void> => {
    await prisma.budget.upsert({
        create: data,
        update: { value: data.value },
        where: {
            periodCategoryId: {
                periodId: data.periodId,
                categoryId: data.categoryId,
            },
        },
    });
};
