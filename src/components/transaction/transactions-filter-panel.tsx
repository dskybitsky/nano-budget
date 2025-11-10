import * as React from 'react';
import { useForm } from '@mantine/form';
import { Button, Collapse, Flex, Group, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { TransactionFilter } from '@/lib/transaction';
import { useEffect } from 'react';
import { IconFilter } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import '@mantine/dates/styles.css';

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

  const [opened, { toggle }] = useDisclosure(false);

  const handleCreatedFromChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), createdFrom: value ?? undefined },
  );

  const handleCreatedToChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), createdTo: value ?? undefined },
  );

  return (
    <form>
      <Flex gap={10}>
        <Button leftSection={<IconFilter size={14} />} variant={opened ? 'light' : 'subtle'} onClick={toggle}>
          {t('TransactionsFilterPanel.filterButtonCaption')}
        </Button>
        <Collapse in={opened}>
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
        </Collapse>
      </Flex>
    </form>
  );
};
