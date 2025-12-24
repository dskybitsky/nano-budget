'use client';

import { Button, Flex, Modal } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexPendingDto } from '@/actions/transaction/transactions-index-pending';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconReceipt } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';

export interface PendingTransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexPendingDto,
}

export const PendingTransactionsView = ({ dto }: PendingTransactionsViewProps) => {
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

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <PageHeader
        title={t('TransactionsIndex.titlePending')}
        leftSection={<IconReceipt size={36} />}
        rightSection={
          <>
            <Modal opened={opened} onClose={close} title={t('TransactionModal.createTitle')}>
              <TransactionForm
                categories={dto.categories}
                onFormSubmit={handleCreateFormSubmit}
                options={{ noDefaultExecuted: true }}
              />
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
        options={{ showTotal: true }}
      />
    </Flex>
  );
};
