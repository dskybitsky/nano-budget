import { Category } from '@prisma/client';

export type Total = {
  expected: number;
  actual: number;
};

export type WithBalance<T> = T & { balance: Total };

export type WithCategory<T extends { categoryId: string }> = T & { category: Category };
