'use client';

import {  Button, Card, Flex, Modal, Tabs, Text, Title } from '@mantine/core';
import React from 'react';
import { AccountViewDto } from '@/actions/account/account-view';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AccountForm, AccountFormValues } from '@/components/account/account-form';
import { useTranslations } from 'next-intl';
import { PeriodsTable } from '@/components/period/periods-table';
import { CategoriesTable } from '@/components/category/categories-table';
import { accountUpdate } from '@/actions/account/account-update';
import { CategoryFormValues } from '@/components/category/category-form';
import { categoryUpdate } from '@/actions/category/category-update';
import { categoryCreate } from '@/actions/category/category-create';
import { categoryDelete } from '@/actions/category/category-delete';
import { periodUpdate } from '@/actions/period/period-update';
import { periodCreate } from '@/actions/period/period-create';
import { periodDelete } from '@/actions/period/period-delete';
import { PeriodFormValues } from '@/components/period/period-form';

export interface AccountViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: AccountViewDto,
}

export const AccountView = ({ dto }: AccountViewProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: AccountFormValues) => {
    await accountUpdate(dto.account.id, formValues);
    close();
  };

  const handleCategoryCreateFormSubmit = async (formValues: CategoryFormValues) => {
    await categoryCreate({ accountId: dto.account.id, ...formValues });
  };

  const handleCategoryUpdateFormSubmit = async (id: string, formValues: CategoryFormValues) => {
    await categoryUpdate(id, formValues);
  };

  const handleCategoryDeleteClick = async (id: string) => {
    await categoryDelete(id);
  };

  const handlePeriodCreateFormSubmit = async (formValues: PeriodFormValues) => {
    await periodCreate({ accountId: dto.account.id, ...formValues });
  };

  const handlePeriodUpdateFormSubmit = async (id: string, formValues: PeriodFormValues) => {
    console.log(id, formValues);
    await periodUpdate(id, formValues);
  };

  const handlePeriodDeleteClick = async (id: string) => {
    await periodDelete(id);
  };

  const t = useTranslations();

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <Card w="100%" padding="lg" radius="md">
        <Title order={4}>{t('AccountView.title', { name: dto.account.name })}</Title>
        <Text mt="md" c="gray">
          {t('AccountView.typeLabel', { type: t('Enum.AccountType', { value: dto.account.type })})}
        </Text>
        <Text mt="sm" c="gray">
          {t('AccountView.valueLabel', { value: dto.account.value, currency: dto.account.currency })}
        </Text>
        <Flex w="100%" justify="end" gap={10}>
          <Modal opened={opened} onClose={close} title={t('AccountModal.editTitle')}>
            <AccountForm account={dto.account} onFormSubmit={handleFormSubmit} />
          </Modal>
          <Button leftSection={<IconPencil size={14} />} onClick={open}>{t('Common.edit')}</Button>
          <Button leftSection={<IconTrash size={14} />} color="red">{t('Common.delete')}</Button>
        </Flex>
      </Card>
      <Tabs w="100%" defaultValue="periods" mt="md">
        <Tabs.List>
          <Tabs.Tab value="categories">
            {t('AccountView.categoriesTabCaption')}
          </Tabs.Tab>
          <Tabs.Tab value="periods">
            {t('AccountView.periodsTabCaption')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="categories">
          <CategoriesTable
            categories={dto.categories}
            onCreateFormSubmit={handleCategoryCreateFormSubmit}
            onUpdateFormSubmit={handleCategoryUpdateFormSubmit}
            onDeleteClick={handleCategoryDeleteClick}
          />
        </Tabs.Panel>
        <Tabs.Panel value="periods">
          <PeriodsTable
            periods={dto.periods}
            onCreateFormSubmit={handlePeriodCreateFormSubmit}
            onUpdateFormSubmit={handlePeriodUpdateFormSubmit}
            onDeleteClick={handlePeriodDeleteClick}
          />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
};
