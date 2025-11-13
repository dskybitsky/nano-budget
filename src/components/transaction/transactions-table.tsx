import * as React from 'react';

import { Account, Category, Transaction } from '@prisma/client';
import { Flex, Modal, Table, Text, ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { EntityImageText } from '@/components/entity-image-text';

export interface TransactionsTableProps {
  account: Account;
  categories: Category[];
  transactions: Transaction[];
  onFormSubmit: (id: string, data: TransactionFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const TransactionsTable = ({
  account,
  categories,
  transactions,
  onFormSubmit,
  onDeleteClick,
}: TransactionsTableProps) => {
  const categoriesIndex = categories.reduce((acc, category) => {
    acc.set(category.id, category);
    return acc;
  }, new Map<string, Category>());

  const t = useTranslations();
  const format = useCustomFormatter();

  return (
    <Table>
      <Table.Caption>{t('TransactionsTable.caption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="180">{t('Transaction.created')}</Table.Th>
          <Table.Th w="120">{t('Transaction.executed')}</Table.Th>
          <Table.Th>{t('Transaction.category')}</Table.Th>
          <Table.Th>{t('Transaction.name')}</Table.Th>
          <Table.Th w="120" ta="right">{t('Transaction.value')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transactions.map((transaction) => (
          <Table.Tr key={transaction.id}>
            <Table.Td>{format.dateTimeShort(transaction.created)}</Table.Td>
            <Table.Td>{format.dateShort(transaction.executed)}</Table.Td>
            <Table.Td>
              <EntityImageText size={18} entity={categoriesIndex.get(transaction.categoryId)!} />
            </Table.Td>
            <Table.Td>{transaction.name}</Table.Td>
            <Table.Td ta="right">{format.monetary(transaction.value, account.currency)}</Table.Td>
            <Table.Td>
              <TransactionsTableActionCell
                categories={categories}
                transaction={transaction}
                onFormSubmit={onFormSubmit}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const TransactionsTableActionCell = ({ categories, transaction, onFormSubmit, onDeleteClick }: {
  categories: Category[],
  transaction: Transaction,
  onFormSubmit: TransactionsTableProps['onFormSubmit'],
  onDeleteClick: TransactionsTableProps['onDeleteClick'],
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: TransactionFormValues) => {
    await onFormSubmit(transaction.id, formValues);
    close();
  };

  const modals = useModals();

  const handleDeleteClick = () => modals.openConfirmModal({
    title: t('TransactionModal.deleteTitle'),
    children: (
      <Text size="sm">
        {t('TransactionModal.deleteMessage')}
      </Text>
    ),
    labels: { confirm: t('Common.ok'), cancel: t('Common.cancel') },
    onConfirm: () => onDeleteClick(transaction.id),
  });

  const t = useTranslations();

  return (
    <>
      <Modal key={transaction.id} opened={opened} onClose={close} title={t('TransactionModal.editTitle')}>
        <TransactionForm
          categories={categories}
          transaction={transaction}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
      <Flex justify="end">
        <ActionIcon variant="subtle" onClick={open}>
          <IconPencil size={14} />
        </ActionIcon>
        <ActionIcon variant="subtle" onClick={handleDeleteClick} color="red">
          <IconTrash size={14} />
        </ActionIcon>
      </Flex>
    </>
  );
};
