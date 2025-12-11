import * as React from 'react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { ErrorText } from '@/components/error-text';
import { TransactionsFilter } from '@/lib/server/transaction';

export interface TransactionFilterFormProps extends React.HTMLAttributes<HTMLElement> {
  filter?: Partial<TransactionsFilter>;
  onFormSubmit: (filter: Partial<TransactionsFilter>) => void;
}

export const TransactionFilterForm = ({ filter, onFormSubmit }: TransactionFilterFormProps) => {
  const t = useTranslations();

  const [error] = useState<unknown|undefined>(undefined);

  const schema = z.object({
    createdFrom: z.date().nullish(),
    createdTo: z.date().nullish(),
    executedFrom: z.date().nullish(),
    executedTo: z.date().nullish(),
  });

  const form = useForm<TransactionsFilter>({
    mode: 'uncontrolled',
    initialValues: filter,
    validate: zod4Resolver(schema),
  });

  const handleFormSubmit = form.onSubmit(onFormSubmit);

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack gap="md">
        <DateTimePickerInput
          key={form.key('createdFrom')}
          label={t('Transaction.created')}
          placeholder={t('TransactionFilterForm.createdFromPlaceholder')}
          clearable
          {...form.getInputProps('createdFrom')}
        />
        <DateTimePickerInput
          key={form.key('createdTo')}
          placeholder={t('TransactionFilterForm.createdToPlaceholder')}
          clearable
          {...form.getInputProps('createdTo')}
        />
        <DateTimePickerInput
          key={form.key('executedFrom')}
          label={t('Transaction.executed')}
          placeholder={t('TransactionFilterForm.executedFromPlaceholder')}
          clearable
          {...form.getInputProps('executedFrom')}
        />
        <DateTimePickerInput
          key={form.key('executedTo')}
          placeholder={t('TransactionFilterForm.executedToPlaceholder')}
          clearable
          {...form.getInputProps('executedTo')}
        />
        {error !== undefined && (
          <ErrorText error={error} p="xs" mt="xs" />
        )}
        <Group justify="flex-end">
          <Button type="submit" disabled={form.submitting}>{t('Common.submit')}</Button>
        </Group>
      </Stack>
    </form>
  );
};
