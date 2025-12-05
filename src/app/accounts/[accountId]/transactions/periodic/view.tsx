'use client';

import { Box, Button, Flex, Modal } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexDto } from '@/actions/transaction/transactions-index';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { redirect } from 'next/navigation';
import { accountTransactionsPeriodicIndexUrl } from '@/lib/url';
import { PeriodPicker } from '@/components/period/period-picker';
import { Period } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';

export interface PeriodicTransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexDto,
}

export const PeriodicTransactionsView = ({ dto }: PeriodicTransactionsViewProps) => {
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
    redirect(accountTransactionsPeriodicIndexUrl(dto.account.id, period.id));
  };

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <PageHeader
        title={t('TransactionsIndex.titlePeriodic')}
        rightSection={
          <>
            <Modal opened={opened} onClose={close} title={t('TransactionModal.createTitle')}>
              <TransactionForm categories={dto.categories} onFormSubmit={handleCreateFormSubmit} />
            </Modal>
            <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={open} >
              {t('TransactionsIndex.createButtonCaption')}
            </Button>
          </>
        }
        bottomSection={
          <>
            <Box/>
            <PeriodPicker periods={dto.periods} periodId={dto.periodId} onChange={handlePeriodChange} />
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
