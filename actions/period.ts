'use server';

import prisma from '@/lib/prismadb';
import { Period } from '@prisma/client';

export const getAccountPeriods = async (accountId: string): Promise<Period[]> => {
    return prisma.period.findMany({
        where: { accountId },
        orderBy: { started: 'asc' },
    });
};

export const getPeriod = async (id: string): Promise<Period | null> => {
    return prisma.period.findFirst({ where: { id } });
};

export const createPeriod = async (period: Omit<Period, 'id'>) => {
    await validatePeriod(period);

    return prisma.period.create({ data: period });
};

export const updatePeriod = async (id: string, period: Partial<Omit<Period, 'id'>>) => {
    await validatePeriod({ ...period, id });

    return prisma.period.update({ where: { id }, data: period });
};

export const deletePeriod = async (id: string) => {
    return prisma.period.delete({ where: { id } });
};

const validatePeriod = async (period: Partial<Period>) => {
    const { id, started, ended } = period;

    if (started && ended && ended <= started) {
        throw new Error('Period end date cannot be set before the start date.');
    }

    const endedNow = ended ?? new Date('3000-01-01');

    const overlapsCount = await prisma.period.count({
        where: {
            accountId: period.accountId,
            AND: [
                ...(id ? [{ id: { not: id } }] : []),
                {
                    OR: [
                        {
                            AND: [
                                { started: { lte: started } },
                                { OR: [{ ended: { gte: started } }, { ended: null }] },
                            ],
                        },
                        {
                            AND: [
                                { started: { lte: endedNow } },
                                { OR: [{ ended: { gte: endedNow } }, { ended: null }] },
                            ],
                        },
                    ],
                },
            ],
        },
    });

    if (overlapsCount > 0) {
        throw new Error('Period overlaps with another one.');
    }
};
