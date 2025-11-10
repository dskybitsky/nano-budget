'use server';

import prisma from '@/lib/prismadb';
import { Category } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cache } from '@/lib/cache';

const CATEGORY_CACHE_TAG = 'category';
const CATEGORY_CACHE_RETENTION = 3600;

export const getCategory = cache(
  async (id: string): Promise<Category | null> => prisma.category.findFirst({ where: { id } }),
  ['get-category'],
  { revalidate: CATEGORY_CACHE_RETENTION, tags: [CATEGORY_CACHE_TAG] },
);

export const getCategories = cache(
  async (accountId: string): Promise<Category[]> =>
    prisma.category.findMany({ where: { accountId }, orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
  ['get-categories'],
  { revalidate: CATEGORY_CACHE_RETENTION, tags: [CATEGORY_CACHE_TAG] },
);

export const createCategory = async (data: Omit<Category, 'id'>) => {
  return prisma.category.create({ data }).then(() => revalidateTag(CATEGORY_CACHE_TAG));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>) => {
  return prisma.category.update({ where: { id }, data }).then(() => revalidateTag(CATEGORY_CACHE_TAG));
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } }).then(() => revalidateTag(CATEGORY_CACHE_TAG));
};
