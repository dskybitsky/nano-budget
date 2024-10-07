import * as React from 'react';

import { Account, Budget, Category } from '@prisma/client';
import { Menu, Modal, Table, UnstyledButton } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconDotsVertical, IconPencil } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { BudgetForm, BudgetFormValues } from '@/components/budget/budget-form';

export interface BudgetsTableProps {
  account: Account;
  categories: Category[];
  budgets: Budget[];
  onSetFormSubmit: (categoryId: string, periodId: string, data: BudgetFormValues) => Promise<void>;
}

export const BudgetsTable = ({
  account,
  categories,
  budgets,
  onSetFormSubmit,
}: BudgetsTableProps) => {
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
          <Table.Th>{t('Budget.category')}</Table.Th>
          <Table.Th w="120">{t('Budget.value')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {budgets.map((budget) => (
          <Table.Tr key={`${budget.periodId}:${budget.categoryId}:row`}>
            <Table.Td>{categoriesIndex.get(budget.categoryId)?.name ?? ''}</Table.Td>
            <Table.Td>{format.narrowCurrency(budget.value, account.currency)}</Table.Td>
            <Table.Td>
              <BudgetsTableActionCell
                budget={budget}
                onSetFormSubmit={onSetFormSubmit}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const BudgetsTableActionCell = ({ budget, onSetFormSubmit }: {
  budget: Budget,
  onSetFormSubmit: BudgetsTableProps['onSetFormSubmit'],
}) => {
  const [setOpened, { open: openSet, close: closeSet }] = useDisclosure(false);

  const handleSetFormSubmit = async (formValues: BudgetFormValues) => {
    await onSetFormSubmit(budget.categoryId, budget.periodId, formValues);
    closeSet();
  };

  const t = useTranslations();

  return (
    <>
      <Modal
        key={`${budget.categoryId}:${budget.periodId}:modal`}
        opened={setOpened}
        onClose={closeSet}
        title={t('BudgetModal.setTitle')}
      >
        <BudgetForm
          budget={budget}
          onFormSubmit={handleSetFormSubmit}
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
          <Menu.Item leftSection={ <IconPencil size={14} /> } onClick={openSet}>
            {t('Common.edit')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
