'use client';

import { Button, Flex, Modal, Title } from '@mantine/core';
import React from 'react';
import { AccountsTable } from '@/components/account/accounts-table';
import { accountCreate } from '@/actions/account/account-create';
import { AccountForm, AccountFormValues } from '@/components/account/account-form';
import { accountUpdate } from '@/actions/account/account-update';
import { accountDelete } from '@/actions/account/account-delete';
import { AccountsIndexDto } from '@/actions/account/accounts-index';
import { redirect } from 'next/navigation';
import { accountViewUrl } from '@/lib/url';
import { useTranslations } from 'next-intl';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export interface AccountsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: AccountsIndexDto,
}

export const AccountsView = ({ dto }: AccountsViewProps) => {
  const t = useTranslations();

  const [opened, { open, close }] = useDisclosure(false);

  const handleCreateFormSubmit = async (formValues: AccountFormValues) => {
    await accountCreate(formValues);
    close();
  };

  const handleUpdateFormSubmit = async (id: string, formValues: AccountFormValues) => {
    await accountUpdate(id, formValues);
  };

  const handleViewClick = (id: string) => {
    redirect(accountViewUrl(id));
  };

  const handleDeleteClick = async (id: string) => {
    await accountDelete(id);
  };

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
    >
      <Flex justify="space-between" align="center" w="100%">
        <Title order={3}>{t('AccountsIndex.title')}</Title>
        <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={open} >
          {t('AccountsIndex.createButtonCaption')}
        </Button>
        <Modal opened={opened} onClose={close} title={t('AccountModal.createTitle')}>
          <AccountForm onFormSubmit={handleCreateFormSubmit} />
        </Modal>
      </Flex>
      <AccountsTable
        accounts={dto.accounts}
        onFormSubmit={handleUpdateFormSubmit}
        onViewClick={handleViewClick}
        onDeleteClick={handleDeleteClick}
      />
    </Flex>
  );
};
