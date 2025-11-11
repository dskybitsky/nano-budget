import * as React from 'react';
import { useState } from 'react';
import { Category, OperationType, Transaction } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { ErrorText } from '@/components/error-text';
import { CategoriesSelect } from '@/components/category/categories-select';

export type TransactionFormValues = Pick<
  Transaction,
  'created' | 'executed' | 'categoryId' | 'name' | 'type' | 'value'
>;

export interface TransactionFormProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[];
  transaction?: TransactionFormValues;
  onFormSubmit: (data: TransactionFormValues) => Promise<void>;
}

export const TransactionForm = ({ categories, transaction, onFormSubmit }: TransactionFormProps) => {
  const t = useTranslations();

  const [error, setError] = useState<unknown|undefined>(undefined);

  const schema = z.object({
    categoryId: z.string(),
    created: z.date(),
    executed: z.date().nullish(),
    name: z
      .string()
      .min(2, {
        message: t('Validation.tooShort', { property: t('Transaction.name'), min: 2 }),
      })
      .max(80, {
        message: t('Validation.tooLong', { property: t('Transaction.name'), max: 80 }),
      }),
    type: z.enum([OperationType.debit, OperationType.credit]),
    value: z.coerce.number().gt(0, {
      message: t('Validation.negative', { property: t('Transaction.value') }),
    }),
  });

  const form = useForm<TransactionFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      created: transaction?.created ?? new Date(),
      executed: transaction?.executed ?? null,
      categoryId: transaction?.categoryId ?? categories[0]?.id,
      name: transaction?.name ?? '',
      type: transaction?.type ?? OperationType.credit,
      value: transaction?.value ?? 0,
    },
    validate: zod4Resolver(schema),
  });

  const handleFormSubmit = form.onSubmit(async (data: TransactionFormValues) => {
    try {
      await onFormSubmit(data);
    } catch (error) {
      setError(error);
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <DateTimePickerInput
        label={t('Transaction.created')}
        placeholder={t('TransactionForm.createdPlaceholder')}
        {...form.getInputProps('created')}
      />
      <DateTimePickerInput
        clearable
        label={t('Transaction.executed')}
        placeholder={t('TransactionForm.executedPlaceholder')}
        mt="md"
        {...form.getInputProps('executed')}
      />
      <CategoriesSelect
        label={t('Transaction.category')}
        placeholder={t('TransactionForm.categoryPlaceholder')}
        key={form.key('categoryId')}
        mt="md"
        categories={categories}
        {...form.getInputProps('categoryId')}
      />
      <TextInput
        label={t('Transaction.name')}
        placeholder={t('TransactionForm.namePlaceholder')}
        key={form.key('name')}
        mt="md"
        {...form.getInputProps('name')}
      />
      <NumberInput
        label={t('Transaction.value')}
        placeholder={t('TransactionForm.valuePlaceholder')}
        key={form.key('value')}
        mt="md"
        {...form.getInputProps('value')}
      />
      {error !== undefined && (
        <ErrorText error={error} p="xs" mt="xs" />
      )}
      <Group justify="flex-end" mt="md">
        <Button type="submit">{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
