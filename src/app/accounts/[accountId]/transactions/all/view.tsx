'use client';

import { Button, Flex, Modal, Pagination } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexAllDto } from '@/actions/transaction/transactions-index-all';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { TransactionsFilterPanel } from '@/components/transaction/transactions-filter-panel';
import { redirect } from 'next/navigation';
import { accountTransactionsAllIndexUrl } from '@/lib/url';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';
import { TransactionsFilter } from '@/lib/server/transaction';

export interface AllTransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexAllDto,
  filter?: TransactionsFilter,
  page?: number,
}

export const AllTransactionsView = ({ dto, filter, page }: AllTransactionsViewProps) => {
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

  const handleFilterChange = useDebouncedCallback((filter: TransactionsFilter) => {
    redirect(accountTransactionsAllIndexUrl(dto.account.id, filter));
  }, 1000);

  const handlePaginationChange = (page: number) => {
    redirect(accountTransactionsAllIndexUrl(dto.account.id, filter, page));
  };

  const totalPages = Math.ceil(dto.transactionsCount / dto.transactionsPerPage);

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <PageHeader
        title={t('TransactionsIndex.titleAll')}
        rightSection={
          <>
            <TransactionsFilterPanel filter={filter} onFilterChange={handleFilterChange} />
            <Modal opened={opened} onClose={close} title={t('TransactionModal.createTitle')}>
              <TransactionForm categories={dto.categories} onFormSubmit={handleCreateFormSubmit} />
            </Modal>
            <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={open} >
              {t('TransactionsIndex.createButtonCaption')}
            </Button>
          </>
        }
      />
      <TransactionsTable
        account={dto.account}
        categories={dto.categories}
        transactions={dto.transactions}
        onFormSubmit={handleUpdateFormSubmit}
        onDeleteClick={handleDeleteClick}
      />
      <Pagination
        total={totalPages}
        value={page}
        withEdges={true}
        withControls={false}
        onChange={handlePaginationChange}
      />
    </Flex>
  );
};
