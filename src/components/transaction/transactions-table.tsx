import * as React from 'react';

import { Account, AccountType, Category, OperationType, Transaction } from '@prisma/client';
import { Flex, Modal, Table, Text, ActionIcon, Box } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { EntityImageText } from '@/components/entity-image-text';
import { monetaryEqual } from '@/lib/utils';
import { Total } from '@/lib/types';

export interface TransactionsTableProps {
  account: Account;
  categories: Category[];
  transactions: Transaction[];
  total: Total;
  onFormSubmit: (id: string, data: TransactionFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const TransactionsTable = ({
  account,
  categories,
  transactions,
  total,
  onFormSubmit,
  onDeleteClick,
}: TransactionsTableProps) => {
  const categoriesIndex = categories.reduce((acc, category) => {
    acc.set(category.id, category);
    return acc;
  }, new Map<string, Category>());

  const t = useTranslations();
  const format = useCustomFormatter();

  const getValue = (transaction: Transaction) => {
    const accountSign = account.type == AccountType.credit ? -1 : 1;
    const sign = transaction.type == OperationType.credit ? -1 : 1;

    return accountSign * sign * transaction.value;
  };

  return (
    <Table>
      <Table.Caption>{t('TransactionsTable.caption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="180">{t('Transaction.created')}</Table.Th>
          <Table.Th w="120" visibleFrom="md">{t('Transaction.executed')}</Table.Th>
          <Table.Th visibleFrom="md">{t('Transaction.category')}</Table.Th>
          <Table.Th>{t('Transaction.name')}</Table.Th>
          <Table.Th w="120" ta="right">{t('Transaction.value')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transactions.map((transaction) => (
          <Table.Tr key={transaction.id}>
            <Table.Td>{format.dateTimeShort(transaction.created)}</Table.Td>
            <Table.Td visibleFrom="md">{format.dateShort(transaction.executed)}</Table.Td>
            <Table.Td visibleFrom="md">
              <EntityImageText size={18} entity={categoriesIndex.get(transaction.categoryId)!} />
            </Table.Td>
            <Table.Td>{transaction.name}</Table.Td>
            <Table.Td ta="right">
              {format.monetary(getValue(transaction), account.currency)}
            </Table.Td>
            <Table.Td ta="right">
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
      <Table.Tfoot>
        <Table.Tr>
          <Table.Th colSpan={4}>{t('TransactionsTable.totalText')}</Table.Th>
          <Table.Th ta="right">
            {format.monetary(total.expected, account.currency)}
            {!monetaryEqual(total.actual, total.expected) && (
              <Box>({format.monetary(total.actual, account.currency)})</Box>
            )}
          </Table.Th>
          <Table.Th/>
        </Table.Tr>
      </Table.Tfoot>
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
