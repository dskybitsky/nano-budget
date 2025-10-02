import * as React from 'react';

import { Account, Category, Transaction } from '@prisma/client';
import { Button, Flex, Menu, Modal, Table, UnstyledButton, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';

export interface TransactionsTableProps {
  account: Account;
  categories: Category[];
  transactions: Transaction[];
  onCreateFormSubmit: (data: TransactionFormValues) => Promise<void>;
  onUpdateFormSubmit: (id: string, data: TransactionFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const TransactionsTable = ({
  account,
  categories,
  transactions,
  onCreateFormSubmit,
  onUpdateFormSubmit,
  onDeleteClick,
}: TransactionsTableProps) => {
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const handleCreateFormSubmit = async (formValues: TransactionFormValues) => {
    await onCreateFormSubmit(formValues);
    closeCreate();
  };

  const categoriesIndex = categories.reduce((acc, category) => {
    acc.set(category.id, category);
    return acc;
  }, new Map<string, Category>());

  const t = useTranslations();
  const format = useCustomFormatter();

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="180">{t('Transaction.created')}</Table.Th>
          <Table.Th w="180">{t('Transaction.executed')}</Table.Th>
          <Table.Th>{t('Transaction.category')}</Table.Th>
          <Table.Th>{t('Transaction.name')}</Table.Th>
          <Table.Th w="120">{t('Transaction.value')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transactions.map((transaction) => (
          <Table.Tr key={transaction.id}>
            <Table.Td>{format.dateTimeShort(transaction.created)}</Table.Td>
            <Table.Td>{format.dateTimeShort(transaction.executed)}</Table.Td>
            <Table.Td>{categoriesIndex.get(transaction.categoryId)?.name ?? ''}</Table.Td>
            <Table.Td>{transaction.name}</Table.Td>
            <Table.Td>{format.monetary(transaction.value, account.currency)}</Table.Td>
            <Table.Td>
              <TransactionsTableActionCell
                categories={categories}
                transaction={transaction}
                onUpdateFormSubmit={onUpdateFormSubmit}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td colSpan={6}>
            <Modal opened={createOpened} onClose={closeCreate} title={t('TransactionModal.createTitle')}>
              <TransactionForm categories={categories} onFormSubmit={handleCreateFormSubmit} />
            </Modal>
            <Flex justify="end">
              <Button leftSection={<IconPlus size={14} />} variant="subtle" size="xs" onClick={openCreate} >
                {t('Common.add')}
              </Button>
            </Flex>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

const TransactionsTableActionCell = ({ categories, transaction, onUpdateFormSubmit, onDeleteClick }: {
  categories: Category[],
  transaction: Transaction,
  onUpdateFormSubmit: TransactionsTableProps['onUpdateFormSubmit'],
  onDeleteClick: TransactionsTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleUpdateFormSubmit = async (formValues: TransactionFormValues) => {
    await onUpdateFormSubmit(transaction.id, formValues);
    closeUpdate();
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
      <Modal key={transaction.id} opened={updateOpened} onClose={closeUpdate} title={t('TransactionModal.editTitle')}>
        <TransactionForm
          categories={categories}
          transaction={transaction}
          onFormSubmit={handleUpdateFormSubmit}
        />
      </Modal>
      <Menu shadow="md">
        <Menu.Target>
          <UnstyledButton w="100%">
            <IconDotsVertical size={14} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{t('Common.actions')}</Menu.Label>
          <Menu.Item leftSection={ <IconPencil size={14} /> } onClick={openUpdate}>
            {t('Common.edit')}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={ <IconTrash size={14} /> } onClick={handleDeleteClick} color="red">
            {t('Common.delete')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
