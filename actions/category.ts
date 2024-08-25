'use server';

import prisma from '@/lib/prismadb';
import { Category } from '@prisma/client';

export const getAccountCategories = async (accountId: string): Promise<Category[]> => {
    return prisma.category.findMany({ where: { accountId }, orderBy: [{ order: 'asc' }, { name: 'asc' }] });
};

export const createCategory = async (data: Omit<Category, 'id'>) => {
    return prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>) => {
    return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string) => {
    return prisma.category.delete({ where: { id } });
};
