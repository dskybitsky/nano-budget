import * as React from 'react';
import { useState } from 'react';
import { Category, OperationType, Transaction } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { ErrorText } from '@/components/error-text';
import { CategoriesSelect } from '@/components/category/categories-select';
import { CurrencyInput } from '@/components/currency-input';
import { dateRound } from '@/lib/utils';
import _ from 'lodash';

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
      executed: transaction?.executed ?? dateRound(new Date()),
      categoryId: transaction?.categoryId ?? categories[0]?.id,
      name: transaction?.name ?? '',
      type: transaction?.type ?? categories[0]?.type ?? OperationType.credit,
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

  const categoriesIndex = _.keyBy(categories, 'id');

  const { onChange: createdOnChange, ...createdInputProps } = form.getInputProps('created');
  const { onChange: categoryIdOnChange, ...categoryIdInputProps } = form.getInputProps('categoryId');

  return (
    <form onSubmit={handleFormSubmit}>
      <DateTimePickerInput
        key={form.key('created')}
        label={t('Transaction.created')}
        placeholder={t('TransactionForm.createdPlaceholder')}
        {...createdInputProps}
        onChange={(value) => {
          if (value) {
            form.setFieldValue('executed', dateRound(value));
          }
          createdOnChange(value);
        }}
      />
      <DateTimePickerInput
        key={form.key('executed')}
        clearable
        label={t('Transaction.executed')}
        placeholder={t('TransactionForm.executedPlaceholder')}
        mt="md"
        {...form.getInputProps('executed')}
      />
      <CategoriesSelect
        key={form.key('categoryId')}
        label={t('Transaction.category')}
        placeholder={t('TransactionForm.categoryPlaceholder')}
        mt="md"
        categories={categories}
        {...categoryIdInputProps}
        onChange={(categoryId) => {
          if (categoryId && !transaction && categoriesIndex[categoryId]) {
            form.setFieldValue('type', categoriesIndex[categoryId].type);
          }

          categoryIdOnChange(categoryId);
        }}
      />
      <Select
        key={form.key('type')}
        label={t('Transaction.type')}
        placeholder={t('TransactionForm.typePlaceholder')}
        mt="md"
        data={[
          { value: OperationType.debit, label: t('Enum.OperationType', { value: OperationType.debit }) },
          { value: OperationType.credit, label: t('Enum.OperationType', { value: OperationType.credit }) },
        ]}
        {...form.getInputProps('type')}
      />
      <TextInput
        key={form.key('name')}
        label={t('Transaction.name')}
        placeholder={t('TransactionForm.namePlaceholder')}
        mt="md"
        {...form.getInputProps('name')}
      />
      <CurrencyInput
        key={form.key('value')}
        label={t('Transaction.value')}
        placeholder={t('TransactionForm.valuePlaceholder')}
        mt="md"
        {...form.getInputProps('value')}
      />
      {error !== undefined && (
        <ErrorText error={error} p="xs" mt="xs" />
      )}
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={form.submitting}>{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
