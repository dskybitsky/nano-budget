import * as React from 'react';

import { Account, Category, Transaction } from '@prisma/client';
import { Flex, Modal, Table, Text, ActionIcon, Box } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { EntityImageText } from '@/components/entity-image-text';
import { monetaryEqual } from '@/lib/utils';
import { calculateTransactionsTotal, calculateTransactionValue } from '@/lib/transaction';
import { TransactionWithCategory } from '@/lib/server/transaction';
import _ from 'lodash';

export interface TransactionsTableProps {
  account: Account;
  categories: Category[];
  transactions: TransactionWithCategory[];
  onFormSubmit: (id: string, data: TransactionFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
  options?: {
    showTotal?: boolean;
  };
}

export const TransactionsTable = ({
  account,
  categories,
  transactions,
  onFormSubmit,
  onDeleteClick,
  options,
}: TransactionsTableProps) => {
  const categoriesIndex = _.keyBy(categories, 'id');

  const t = useTranslations();
  const format = useCustomFormatter();

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
        {transactions.map((transaction) => {
          const category = categoriesIndex[transaction.categoryId];

          return (
            <Table.Tr key={transaction.id}>
              <Table.Td visibleFrom="xs">{format.dateTimeShort(transaction.created)}</Table.Td>
              <Table.Td visibleFrom="md">{format.dateShort(transaction.executed)}</Table.Td>
              <Table.Td hiddenFrom="md">
                <EntityImageText size={18} entity={{ icon: category.icon, name: transaction.name }} />
              </Table.Td>
              <Table.Td visibleFrom="md">
                <EntityImageText size={18} entity={category} />
              </Table.Td>
              <Table.Td visibleFrom="md">
                {transaction.name}
              </Table.Td>
              <Table.Td ta="right">
                {format.monetary(calculateTransactionValue(transaction, account.type), account.currency)}
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
          );
        })}
      </Table.Tbody>
      {options?.showTotal && (
        <TransactionsTableFooter account={account} transactions={transactions} />
      )}
    </Table>
  );
};

const TransactionsTableFooter = ({ account, transactions }: {
  account: Account,
  transactions: TransactionWithCategory[]
}) => {
  const t = useTranslations();
  const format = useCustomFormatter();

  const total = calculateTransactionsTotal(transactions, account.type);

  return (
    <Table.Tfoot>
      <Table.Tr>
        <Table.Th colSpan={2} hiddenFrom="xs">{t('TransactionsTable.totalText')}</Table.Th>
        <Table.Th colSpan={3} visibleFrom="xs" hiddenFrom="md">{t('TransactionsTable.totalText')}</Table.Th>
        <Table.Th colSpan={5} visibleFrom="md">{t('TransactionsTable.totalText')}</Table.Th>
        <Table.Th ta="right">
          {format.monetary(total.expected, account.currency)}
          {!monetaryEqual(total.actual, total.expected) && (
            <Box>({format.monetary(total.actual, account.currency)})</Box>
          )}
        </Table.Th>
        <Table.Th/>
      </Table.Tr>
    </Table.Tfoot>
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
