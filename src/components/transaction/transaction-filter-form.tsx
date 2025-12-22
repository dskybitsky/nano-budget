import * as React from 'react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { ErrorText } from '@/components/error-text';
import { TransactionsFilter } from '@/lib/server/transaction';
import { Category } from '@prisma/client';
import { CategoriesMultiSelect } from '@/components/category/categories-multi-select';
import { IconClearAll } from '@tabler/icons-react';

export interface TransactionFilterFormProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[];
  filter?: Partial<TransactionsFilter>;
  onFormSubmit: (filter: Partial<TransactionsFilter>) => void;
}

export const TransactionFilterForm = ({ categories, filter, onFormSubmit }: TransactionFilterFormProps) => {
  const t = useTranslations();

  const [error] = useState<unknown|undefined>(undefined);

  const schema = z.object({
    name: z.string().nullish(),
    categoryIdList: z.array(z.string()).nullish(),
    createdFrom: z.date().nullish(),
    createdTo: z.date().nullish(),
    executedFrom: z.date().nullish(),
    executedTo: z.date().nullish(),
  });

  const form = useForm<TransactionsFilter>({
    mode: 'uncontrolled',
    initialValues: {
      name: filter?.name,
      categoryIdList: filter?.categoryIdList,
      createdFrom: filter?.createdFrom,
      createdTo: filter?.createdTo,
      executedFrom: filter?.executedFrom,
      executedTo: filter?.executedTo,
    },
    validate: zod4Resolver(schema),
  });

  const handleFormSubmit = form.onSubmit(onFormSubmit);
  const handleFormReset = () => {
    form.setValues({
      name: undefined,
      categoryIdList: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      executedFrom: undefined,
      executedTo: undefined,
    });
  };


  return (
    <form onSubmit={handleFormSubmit}>
      <Stack gap="md">
        <TextInput
          key={form.key('name')}
          label={t('Transaction.name')}
          placeholder={t('TransactionFilterForm.namePlaceholder')}
          {...form.getInputProps('name')}
        />
        <CategoriesMultiSelect
          key={form.key('categoryId')}
          label={t('Transaction.category')}
          placeholder={t('TransactionFilterForm.categoriesPlaceholder')}
          categories={categories}
          {...form.getInputProps('categoryIdList')}
        />
        <Group gap="md" align="flex-end" w="100%" justify="space-between">
          <DateTimePickerInput
            key={form.key('createdFrom')}
            label={t('Transaction.created')}
            placeholder={t('TransactionFilterForm.fromPlaceholder')}
            clearable
            {...form.getInputProps('createdFrom')}
            flex="1"
          />
          <DateTimePickerInput
            key={form.key('createdTo')}
            placeholder={t('TransactionFilterForm.toPlaceholder')}
            clearable
            {...form.getInputProps('createdTo')}
            flex="1"
          />
        </Group>
        <Group gap="md" align="flex-end" w="100%" justify="space-between">
          <DateTimePickerInput
            key={form.key('executedFrom')}
            label={t('Transaction.executed')}
            placeholder={t('TransactionFilterForm.fromPlaceholder')}
            clearable
            {...form.getInputProps('executedFrom')}
            flex="1"
          />
          <DateTimePickerInput
            key={form.key('executedTo')}
            placeholder={t('TransactionFilterForm.toPlaceholder')}
            clearable
            {...form.getInputProps('executedTo')}
            flex="1"
          />
        </Group>
        {error !== undefined && (
          <ErrorText error={error} p="xs" mt="xs" />
        )}
        <Group justify="flex-end">
          <Button
            type="button"
            disabled={form.submitting}
            variant="outline"
            leftSection={<IconClearAll size={14} />}
            onClick={handleFormReset}
          >{t('Common.reset')}</Button>
          <Button type="submit" disabled={form.submitting}>{t('Common.submit')}</Button>
        </Group>
      </Stack>
    </form>
  );
};
