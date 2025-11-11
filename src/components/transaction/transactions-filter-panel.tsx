import * as React from 'react';
import { useForm } from '@mantine/form';
import { Button, Collapse, Flex, Group, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { useEffect } from 'react';
import { IconFilter } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { TransactionFilterDto } from '@/actions/transaction/transactions-index';
import '@mantine/dates/styles.css';

export interface TransactionsFilterPanelProps extends React.HTMLAttributes<HTMLElement> {
  filter?: TransactionFilterDto;
  onFilterChange: (filter: TransactionFilterDto) => void;
}

export const TransactionsFilterPanel = ({ filter, onFilterChange }: TransactionsFilterPanelProps) => {
  const t = useTranslations();

  const form = useForm<TransactionFilterDto>({
    mode: 'uncontrolled',
    initialValues: {
      executedFrom: filter?.executedFrom,
      executedTo: filter?.executedTo,
    },
  });

  useEffect(() => {
    if (filter) {
      form.setValues({
        executedFrom: filter.executedFrom,
        executedTo: filter.executedTo,
      });
    }
  }, [filter]);

  const [opened, { toggle }] = useDisclosure(false);

  const handleCreatedFromChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), executedFrom: value ?? undefined },
  );

  const handleCreatedToChange = (value: Date | null) => onFilterChange(
    { ...form.getValues(), executedTo: value ?? undefined },
  );

  return (
    <form>
      <Flex gap={10}>
        <Button leftSection={<IconFilter size={14} />} variant={opened ? 'light' : 'subtle'} onClick={toggle}>
          {t('TransactionsFilterPanel.filterButtonCaption')}
        </Button>
        <Collapse in={opened}>
          <Group justify="flex-end">
            <Text fw={500}>{t('TransactionsFilterPanel.executedLabel')}</Text>
            <DateTimePickerInput
              clearable
              placeholder={t('TransactionsFilterPanel.executedFromPlaceholder')}
              {...form.getInputProps('executedFrom')}
              onChange={handleCreatedFromChange}
              key={form.key('executedFrom')}
            />
            <DateTimePickerInput
              clearable
              placeholder={t('TransactionsFilterPanel.executedToPlaceholder')}
              {...form.getInputProps('executedTo')}
              onChange={handleCreatedToChange}
              key={form.key('executedTo')}
            />
          </Group>
        </Collapse>
      </Flex>
    </form>
  );
};
