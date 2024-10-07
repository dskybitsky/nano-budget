import * as React from 'react';

import { useForm } from '@mantine/form';
import { Group, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';

import '@mantine/dates/styles.css';
import { TransactionFilter } from '@/lib/model/transaction';
import { useEffect } from 'react';

export interface TransactionsFilterPanelProps extends React.HTMLAttributes<HTMLElement> {
  filter?: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
}

export const TransactionsFilterPanel = ({ filter, onFilterChange }: TransactionsFilterPanelProps) => {
  const t = useTranslations();

  const form = useForm<TransactionFilter>({
    mode: 'uncontrolled',
    initialValues: {
      createdFrom: filter?.createdFrom,
      createdTo: filter?.createdTo,
    },
  });

  useEffect(() => {
    if (filter) {
      form.setValues({
        createdFrom: filter.createdFrom,
        createdTo: filter.createdTo,
      });
    }
  }, [filter]);

  const handleCreatedFromChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), createdFrom: value ?? undefined },
  );

  const handleCreatedToChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), createdTo: value ?? undefined },
  );

  return (
    <form className="space-y-8">
      <Group justify="flex-end">
        <Text fw={500}>{t('TransactionsFilterPanel.createdLabel')}</Text>
        <DateTimePickerInput
          clearable
          placeholder={t('TransactionsFilterPanel.createdFromPlaceholder')}
          {...form.getInputProps('createdFrom')}
          onChange={handleCreatedFromChange}
          key={form.key('createdFrom')}
        />
        <DateTimePickerInput
          clearable
          placeholder={t('TransactionsFilterPanel.createdToPlaceholder')}
          {...form.getInputProps('createdTo')}
          onChange={handleCreatedToChange}
          key={form.key('createdTo')}
        />
      </Group>
    </form>
  );
};
