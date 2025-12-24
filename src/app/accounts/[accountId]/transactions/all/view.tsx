'use client';

import { Button, Flex, Group, Modal, Pagination, Text } from '@mantine/core';
import React from 'react';
import { TransactionsTable } from '@/components/transaction/transactions-table';
import { TransactionsIndexAllDto } from '@/actions/transaction/transactions-index-all';
import { transactionCreate } from '@/actions/transaction/transaction-create';
import { transactionUpdate } from '@/actions/transaction/transaction-update';
import { transactionDelete } from '@/actions/transaction/transaction-delete';
import { TransactionForm, TransactionFormValues } from '@/components/transaction/transaction-form';
import { redirect } from 'next/navigation';
import { accountTransactionsAllIndexUrl } from '@/lib/url';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter, IconFilterFilled, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';
import { TransactionsFilter } from '@/lib/server/transaction';
import { TransactionFilterForm } from '@/components/transaction/transaction-filter-form';
import { Category } from '@prisma/client';
import _ from 'lodash';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

export interface AllTransactionsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: TransactionsIndexAllDto,
  filter?: TransactionsFilter,
  page?: number,
}

export const AllTransactionsView = ({ dto, filter, page }: AllTransactionsViewProps) => {
  const t = useTranslations();

  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);

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

  const handleFilterChange = (filter: Partial<TransactionsFilter>) => {
    closeFilter();
    redirect(accountTransactionsAllIndexUrl(dto.account.id, filter));
  };

  const handlePaginationChange = (page: number) => {
    redirect(accountTransactionsAllIndexUrl(dto.account.id, filter, page));
  };

  const totalPages = Math.ceil(dto.transactionsCount / dto.transactionsPerPage);

  const filtered = filter && Object.keys(filter).length > 0;

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <PageHeader
        title={t('TransactionsIndex.titleAll')}
        rightSection={
          <Group gap="xs" wrap="nowrap">
            <Modal opened={filterOpened} onClose={closeFilter} title={t('TransactionFilterModal.title')}>
              <TransactionFilterForm categories={dto.categories} filter={filter} onFormSubmit={handleFilterChange} />
            </Modal>
            <Button
              leftSection={filtered ? <IconFilterFilled size={14} /> : <IconFilter size={14} />}
              variant='subtle'
              onClick={openFilter}
            >
              {t('TransactionsIndex.filterButtonCaption')}
            </Button>
            <Modal opened={createOpened} onClose={closeCreate} title={t('TransactionModal.createTitle')}>
              <TransactionForm categories={dto.categories} onFormSubmit={handleCreateFormSubmit} />
            </Modal>
            <Button leftSection={<IconPlus size={14} />} variant="subtle" onClick={openCreate} >
              {t('TransactionsIndex.createButtonCaption')}
            </Button>
          </Group>
        }
        bottomSection={
          filtered ? <FilterDescriptionText filter={filter} categories={dto.categories} /> : undefined
        }
      />
      <TransactionsTable
        account={dto.account}
        categories={dto.categories}
        transactions={dto.transactions}
        onFormSubmit={handleUpdateFormSubmit}
        onDeleteClick={handleDeleteClick}
      />
      <Pagination
        total={totalPages}
        value={page}
        withEdges={true}
        withControls={false}
        onChange={handlePaginationChange}
      />
    </Flex>
  );
};

const FilterDescriptionText = ({ filter, categories }: {
  filter: TransactionsFilter,
  categories: Category[]
}) => {
  const strings: string[] = [];

  const t = useTranslations();
  const format = useCustomFormatter();

  const categoryIndex = _.keyBy(categories, 'id');

  if (filter.name) {
    strings.push(t('TransactionsIndex.filterTextName', { name: filter.name }));
  }

  if (filter.categoryIdList) {
    strings.push(t('TransactionsIndex.filterTextCategories', {
      categories: filter.categoryIdList
        .map((id) => categoryIndex[id].name)
        .join(', '),
    }));
  }

  if (filter.createdFrom || filter.createdTo) {
    if (filter.createdFrom && !filter.createdTo) {
      strings.push(t('TransactionsIndex.filterTextCreated', {
        created: t('Common.parts.after', { from: format.dateTimeShort(filter.createdFrom) }),
      }));
    } else if (!filter.createdFrom && filter.createdTo) {
      strings.push(t('TransactionsIndex.filterTextCreated', {
        created: t('Common.parts.before', { to: format.dateTimeShort(filter.createdTo) }),
      }));
    } else {
      strings.push(t('TransactionsIndex.filterTextCreated', {
        created: t('Common.parts.between', {
          from: format.dateTimeShort(filter.createdFrom),
          to: format.dateTimeShort(filter.createdTo),
        }),
      }));
    }
  }

  if (filter.executedFrom || filter.executedTo) {
    if (filter.executedFrom && !filter.executedTo) {
      strings.push(t('TransactionsIndex.filterTextExecuted', {
        executed: t('Common.parts.after', { from: format.dateTimeShort(filter.executedFrom) }),
      }));
    } else if (!filter.executedFrom && filter.executedTo) {
      strings.push(t('TransactionsIndex.filterTextExecuted', {
        executed: t('Common.parts.before', { to: format.dateTimeShort(filter.executedTo) }),
      }));
    } else {
      strings.push(t('TransactionsIndex.filterTextExecuted', {
        executed: t('Common.parts.between', {
          from: format.dateTimeShort(filter.executedFrom),
          to: format.dateTimeShort(filter.executedTo),
        }),
      }));
    }
  }

  return <Text fz={12}>{ strings.join('. ') }</Text>;
};
