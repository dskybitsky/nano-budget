'use client';

import { Box, Button, Flex, Modal } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionFilterDto, TransactionsIndexAllDto } from '@/actions/transaction/transactions-index-all';
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

export interface AllTransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexAllDto,
  filter?: TransactionFilterDto,
}

export const AllTransactionsView = ({ dto, filter }: AllTransactionsViewProps) => {
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

  const handleFilterChange = useDebouncedCallback((filter: TransactionFilterDto) => {
    redirect(accountTransactionsAllIndexUrl(dto.account.id, filter));
  }, 1000);

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
