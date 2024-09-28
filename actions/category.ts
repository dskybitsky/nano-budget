'use server';

import prisma from '@/lib/prismadb';
import { Category } from '@prisma/client';
import { cache, invalidate, Store } from '@/lib/cache';

const categoriesStore: Store<Category | null> = new Map<string, Category | null>();
const accountCategoriesStore: Store<Category[]> = new Map<string, Category[]>();

export const getCategory = async (id: string): Promise<Category | null> => {
    return cache(categoriesStore, () => prisma.category.findFirst({ where: { id } }), id);
};

export const getAccountCategories = async (accountId: string): Promise<Category[]> => {
    return cache(
        accountCategoriesStore,
        () => prisma.category.findMany({ where: { accountId }, orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
        accountId,
    );
};

export const createCategory = async (data: Omit<Category, 'id'>) => {
    return prisma.category.create({ data }).then(({ id, accountId }) => invalidateCategory(id, accountId));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>) => {
    return prisma.category
        .update({ where: { id }, data })
        .then(({ id, accountId }) => invalidateCategory(id, accountId));
};

export const deleteCategory = async (id: string) => {
    return prisma.category.delete({ where: { id } }).then(({ id, accountId }) => invalidateCategory(id, accountId));
};

const invalidateCategory = (id: string, accountId: string) => {
    invalidate(categoriesStore, id);
    invalidate(accountCategoriesStore, accountId);
};
