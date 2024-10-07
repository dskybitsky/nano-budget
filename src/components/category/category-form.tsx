import * as React from 'react';

import { OperationType, Category } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, NumberInput, Select, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';

export type CategoryFormValues = Pick<Category, 'name' | 'type' | 'icon' | 'order'>;

export interface CategoryFormProps extends React.HTMLAttributes<HTMLElement> {
  category?: Category;
  onFormSubmit: (data: CategoryFormValues) => Promise<void>;
}

export const CategoryForm = ({ category, onFormSubmit }: CategoryFormProps) => {
  const t = useTranslations();

  const schema = z.object({
    name: z
      .string()
      .min(2, {
        message: t('Validation.tooShort', { property: t('Category.name'), min: 2 }),
      })
      .max(80, {
        message: t('Validation.tooLong', { property: t('Category.name'), max: 80 }),
      }),
    type: z.enum([OperationType.debit, OperationType.credit]),
    icon: z.string(),
    order: z.coerce.number(),
  });

  const form = useForm<CategoryFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: category?.name ?? '',
      type: category?.type ?? OperationType.debit,
      icon: category?.icon ?? '',
      order: category?.order ?? 0,
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)} className="space-y-8">
      <TextInput
        label={t('Category.name')}
        placeholder={t('CategoryForm.namePlaceholder')}
        key={form.key('name')}
        mt="md"
        {...form.getInputProps('name')}
      />
      <Select
        label={t('Category.type')}
        placeholder={t('CategoryForm.typePlaceholder')}
        key={form.key('type')}
        mt="md"
        data={[
          { value: OperationType.debit, label: t('Enum.OperationType', { value: OperationType.debit}) },
          { value: OperationType.credit, label: t('Enum.OperationType', { value: OperationType.credit}) },
        ]}
        {...form.getInputProps('type')}
      />
      <TextInput
        label={t('Category.icon')}
        placeholder={t('CategoryForm.iconPlaceholder')}
        key={form.key('icon')}
        mt="md"
        {...form.getInputProps('icon')}
      />
      <NumberInput
        label={t('Category.order')}
        placeholder={t('CategoryForm.orderPlaceholder')}
        key={form.key('order')}
        mt="md"
        {...form.getInputProps('order')}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
