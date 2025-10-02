'use client';

import { Box, Flex } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexDto } from '@/actions/transaction/transactions-index';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionFormValues } from '@/components/transaction/transaction-form';
import { TransactionsFilterPanel } from '@/components/transaction/transactions-filter-panel';
import { TransactionFilter } from '@/lib/model/transaction';
import { redirect } from 'next/navigation';
import { createTransactionsUrl } from '@/lib/url';
import { PeriodPicker } from '@/components/period/period-picker';
import { Period } from '@prisma/client';
import { useDebouncedCallback } from '@mantine/hooks';

export interface TransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexDto,
  filter?: TransactionFilter,
}

export const TransactionsView = ({ dto, filter }: TransactionsViewProps) => {
  const handleCreateFormSubmit = async (formValues: TransactionFormValues) => {
    await transactionCreate(formValues);
  };

  const handleUpdateFormSubmit = async (id: string, formValues: TransactionFormValues) => {
    await transactionUpdate(id, formValues);
  };

  const handleDeleteClick = async (id: string) => {
    await transactionDelete(id);
  };

  const handlePeriodChange = (period: Period) => {
    redirect(createTransactionsUrl(dto.account.id, {
      createdFrom: period.started,
      createdTo: period.ended ?? undefined,
    }));
  };

  const handleFilterChange = useDebouncedCallback((filter: TransactionFilter) => {
    redirect(createTransactionsUrl(dto.account.id, filter));
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
      <Flex gap={20} w="100%" justify="space-between" align="center">
        <PeriodPicker periods={dto.periods} periodId={periodId} onChange={handlePeriodChange} />
        <TransactionsFilterPanel filter={filter} onFilterChange={handleFilterChange} />
      </Flex>
      <Box w="100%" mt="md">
        <TransactionsTable
          account={dto.account}
          categories={dto.categories}
          transactions={dto.transactions}
          onCreateFormSubmit={handleCreateFormSubmit}
          onUpdateFormSubmit={handleUpdateFormSubmit}
          onDeleteClick={handleDeleteClick}
        />
      </Box>
    </Flex>
  );
};
