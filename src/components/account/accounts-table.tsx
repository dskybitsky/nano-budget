import * as React from 'react';

import { Account } from '@prisma/client';
import { Flex, Modal, Table, Text, ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { AccountForm, AccountFormValues } from '@/components/account/account-form';
import { EntityImageText } from '@/components/entity-image-text';

export interface AccountsTableProps {
  accounts: Account[];
  onFormSubmit: (id: string, data: AccountFormValues) => Promise<void>;
  onViewClick: (id: string) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const AccountsTable = ({
  accounts,
  onFormSubmit,
  onViewClick,
  onDeleteClick,
}: AccountsTableProps) => {
  const t = useTranslations();

  const format = useCustomFormatter();

  return (
    <Table>
      <Table.Caption>{t('AccountsTable.caption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="20">{t('AccountsTable.orderColumnHeader')}</Table.Th>
          <Table.Th>{t('Account.name')}</Table.Th>
          <Table.Th w="150">{t('Account.type')}</Table.Th>
          <Table.Th w="120" visibleFrom="xs">{t('Account.value')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {accounts.map((account) => (
          <Table.Tr key={account.id}>
            <Table.Td>{account.order}</Table.Td>
            <Table.Td>
              <EntityImageText size={18} entity={account} />
            </Table.Td>
            <Table.Td>{t('Enum.AccountType', { value: account.type })}</Table.Td>
            <Table.Td visibleFrom="xs">{format.monetary(account.value, account.currency)}</Table.Td>
            <Table.Td>
              <AccountTableActionCell
                account={account}
                onFormSubmit={onFormSubmit}
                onViewClick={onViewClick}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const AccountTableActionCell = ({ account, onFormSubmit, onViewClick, onDeleteClick }: {
  account: Account,
  onFormSubmit: AccountsTableProps['onFormSubmit'],
  onViewClick: AccountsTableProps['onViewClick'],
  onDeleteClick: AccountsTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: AccountFormValues) => {
    await onFormSubmit(account.id, formValues);
    closeUpdate();
  };

  const modals = useModals();

  const handleViewClick = () => onViewClick(account.id);

  const handleDeleteClick = () => modals.openConfirmModal({
    title: t('AccountModal.deleteTitle'),
    children: (
      <Text size="sm">
        {t('AccountModal.deleteMessage')}
      </Text>
    ),
    labels: { confirm: t('Common.ok'), cancel: t('Common.cancel') },
    onConfirm: () => onDeleteClick(account.id),
  });

  const t = useTranslations();

  return (
    <>
      <Modal key={account.id} opened={updateOpened} onClose={closeUpdate} title={t('AccountModal.editTitle')}>
        <AccountForm
          account={account}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
      <Flex justify="end">
        <ActionIcon variant="subtle" onClick={handleViewClick}>
          <IconEye size={14} />
        </ActionIcon>
        <ActionIcon variant="subtle" onClick={openUpdate}>
          <IconPencil size={14} />
        </ActionIcon>
        <ActionIcon variant="subtle" onClick={handleDeleteClick} color="red">
          <IconTrash size={14} />
        </ActionIcon>
      </Flex>
    </>
  );
};
