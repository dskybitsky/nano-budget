'use client';

import { Box, Button, Flex, Modal, Title } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexDto } from '@/actions/transaction/transactions-index';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { TransactionsFilterPanel } from '@/components/transaction/transactions-filter-panel';
import { redirect } from 'next/navigation';
import { accountTransactionsIndexUrl } from '@/lib/url';
import { TransactionFilter } from '@/lib/transaction';
import { PeriodPicker } from '@/components/period/period-picker';
import { Period } from '@prisma/client';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export interface TransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexDto,
  filter?: TransactionFilter,
}

export const TransactionsView = ({ dto, filter }: TransactionsViewProps) => {
  const t = useTranslations();

  const [opened, { open, close }] = useDisclosure(false);

  const handleCreateFormSubmit = async (formValues: TransactionFormValues) => {
    await transactionCreate(formValues);
    close();
  };

  const handleUpdateFormSubmit = async (id: string, formValues: TransactionFormValues) => {
    await transactionUpdate(id, formValues);
  };

  const handleDeleteClick = async (id: string) => {
    await transactionDelete(id);
  };

  const handlePeriodChange = (period: Period) => {
    redirect(accountTransactionsIndexUrl(dto.account.id, {
      createdFrom: period.started,
      createdTo: period.ended ?? undefined,
    }));
  };

  const handleFilterChange = useDebouncedCallback((filter: TransactionFilter) => {
    redirect(accountTransactionsIndexUrl(dto.account.id, filter));
  }, 1000);

  const periodId = dto.periods.find((period) => (
    period.started.getTime() === filter?.createdFrom?.getTime()
    && period.ended?.getTime() === filter?.createdTo?.getTime()
  ))?.id;

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <Flex justify="space-between" align="flex-start" w="100%">
        <Title order={3}>{t('TransactionsIndex.title')}</Title>
        <PeriodPicker periods={dto.periods} periodId={periodId} onChange={handlePeriodChange} />
      </Flex>
      <Flex justify="space-between" align="flex-start" w="100%">
        <TransactionsFilterPanel filter={filter} onFilterChange={handleFilterChange} />
        <Modal opened={opened} onClose={close} title={t('TransactionModal.createTitle')}>
          <TransactionForm categories={dto.categories} onFormSubmit={handleCreateFormSubmit} />
        </Modal>
        <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={open} >
          {t('TransactionsIndex.createButtonCaption')}
        </Button>
      </Flex>
      <Box w="100%">
        <TransactionsTable
          account={dto.account}
          categories={dto.categories}
          transactions={dto.transactions}
          onFormSubmit={handleUpdateFormSubmit}
          onDeleteClick={handleDeleteClick}
        />
      </Box>
    </Flex>
  );
};
