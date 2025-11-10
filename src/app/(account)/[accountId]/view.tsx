'use client';

import {  Button, Flex, Modal, Tabs, Text, Title } from '@mantine/core';
import React from 'react';
import { AccountViewDto } from '@/actions/account/account-view';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AccountForm, AccountFormValues } from '@/components/account/account-form';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { PeriodsTable } from '@/components/period/periods-table';
import { CategoriesTable } from '@/components/category/categories-table';
import { accountUpdate } from '@/actions/account/account-update';
import { accountDelete } from '@/actions/account/account-delete';
import { categoryUpdate } from '@/actions/category/category-update';
import { categoryCreate } from '@/actions/category/category-create';
import { categoryDelete } from '@/actions/category/category-delete';
import { periodUpdate } from '@/actions/period/period-update';
import { periodCreate } from '@/actions/period/period-create';
import { periodDelete } from '@/actions/period/period-delete';
import { CategoryForm, CategoryFormValues } from '@/components/category/category-form';
import { PeriodForm, PeriodFormValues } from '@/components/period/period-form';
import { EntityImage } from '@/components/entity-image';

export interface AccountViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: AccountViewDto,
}

export const AccountView = ({ dto }: AccountViewProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [categoryOpened, { open: openCategory, close: closeCategory }] = useDisclosure(false);
  const [periodOpened, { open: openPeriod, close: closePeriod }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: AccountFormValues) => {
    await accountUpdate(dto.account.id, formValues);
    close();
  };

  const handleAccountDeleteClick = async () => {
    await accountDelete(dto.account.id);
    redirect('/');
  };

  const handleCategoryCreateFormSubmit = async (formValues: CategoryFormValues) => {
    await categoryCreate({ accountId: dto.account.id, ...formValues });
    closeCategory();
  };

  const handleCategoryUpdateFormSubmit = async (id: string, formValues: CategoryFormValues) => {
    await categoryUpdate(id, formValues);
  };

  const handleCategoryDeleteClick = async (id: string) => {
    await categoryDelete(id);
  };

  const handlePeriodCreateFormSubmit = async (formValues: PeriodFormValues) => {
    await periodCreate({ accountId: dto.account.id, ...formValues });
    closePeriod();
  };

  const handlePeriodUpdateFormSubmit = async (id: string, formValues: PeriodFormValues) => {
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
    >
      <Flex justify="space-between" align="center" w="100%">
        <Flex w="100%" justify="start" align="center" gap={10} p={5}>
          <EntityImage size={36} entity={dto.account} />
          <Title order={3}>
            {t('AccountView.title', { name: dto.account.name })}
          </Title>
        </Flex>
        <Flex>
          <Button leftSection={<IconPencil size={14} />} variant="subtle" onClick={open}>
            {t('AccountView.editButtonCaption')}
          </Button>
          <Button leftSection={<IconTrash size={14} />} variant="subtle" onClick={handleAccountDeleteClick} color="red">
            {t('AccountView.deleteButtonCaption')}
          </Button>
        </Flex>
        <Modal opened={opened} onClose={close} title={t('AccountModal.editTitle')}>
          <AccountForm account={dto.account} onFormSubmit={handleFormSubmit} />
        </Modal>
      </Flex>
      <Text c="gray">
        {t('AccountView.descriptionLabel', {
          type: t('Enum.AccountType', { value: dto.account.type }),
          value: dto.account.value,
          currency: dto.account.currency,
        })}
      </Text>
      <Tabs w="100%" defaultValue="periods">
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
            onFormSubmit={handleCategoryUpdateFormSubmit}
            onDeleteClick={handleCategoryDeleteClick}
          />
          <Flex justify="end" align="center" w="100%">
            <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={openCategory} >
              {t('AccountView.createCategoryButtonCaption')}
            </Button>
            <Modal opened={categoryOpened} onClose={closeCategory} title={t('CategoryModal.createTitle')}>
              <CategoryForm onFormSubmit={handleCategoryCreateFormSubmit} />
            </Modal>
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="periods">
          <PeriodsTable
            periods={dto.periods}
            onFormSubmit={handlePeriodUpdateFormSubmit}
            onDeleteClick={handlePeriodDeleteClick}
          />
          <Flex justify="end" align="center" w="100%">
            <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={openPeriod} >
              {t('AccountView.createPeriodButtonCaption')}
            </Button>
            <Modal opened={periodOpened} onClose={closePeriod} title={t('PeriodModal.createTitle')}>
              <PeriodForm onFormSubmit={handlePeriodCreateFormSubmit} />
            </Modal>
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
};
