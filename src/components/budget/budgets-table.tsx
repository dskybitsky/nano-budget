import * as React from 'react';

import { Account, Category } from '@prisma/client';
import { ActionIcon, Box, Modal, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconPencil } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { BudgetForm, BudgetFormValues } from '@/components/budget/budget-form';
import { ActualExpectedPlanned } from '@/lib/types';
import { monetaryEqual, monetaryRound } from '@/lib/utils';
import { EntityImageText } from '@/components/entity-image-text';
import _ from 'lodash';

export interface BudgetsTableProps {
  account: Account;
  categories: Category[];
  budgetsByCategory: { [p: string]: ActualExpectedPlanned };
  total: ActualExpectedPlanned;
  onSetFormSubmit: (categoryId: string, data: BudgetFormValues) => Promise<void>;
}

export const BudgetsTable = ({
  account,
  categories,
  budgetsByCategory,
  total,
  onSetFormSubmit,
}: BudgetsTableProps) => {
  const categoryIndex = _.keyBy(categories, 'id');

  const t = useTranslations();
  const format = useCustomFormatter();

  return (
    <Table>
      <Table.Caption>{t('BudgetsTable.caption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('Budget.category')}</Table.Th>
          <Table.Th w="120" ta="right">{t('BudgetsTable.plannedColumnHeader')}</Table.Th>
          <Table.Th w="120" ta="right" visibleFrom="md">{t('BudgetsTable.spentColumnHeader')}</Table.Th>
          <Table.Th w="120" ta="right">{t('BudgetsTable.restColumnHeader')}</Table.Th>
          <Table.Th w="30"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Object.entries(budgetsByCategory).map(([categoryId, budget]) => {
          const category = categoryIndex[categoryId];

          const { planned, actual, expected, rest } = budget;

          const handleSetFormSubmit = async (formValues: BudgetFormValues) => {
            await onSetFormSubmit(categoryId, formValues);
          };

          const rowColor = monetaryRound(rest) == 0
            ? undefined
            : (rest > 0 ? 'green.1' : 'red.1');

          return (
            <Table.Tr key={`${categoryId}:row`} bg={rowColor}>
              <Table.Td>
                <EntityImageText size={18} entity={category} />
              </Table.Td>
              <Table.Td ta="right">{format.monetary(planned, account.currency)}</Table.Td>
              <Table.Td ta="right" visibleFrom="xs">
                {format.monetary(expected, account.currency)}
                {!monetaryEqual(actual, expected) && (
                  <Box>({format.monetary(actual, account.currency)})</Box>
                )}
              </Table.Td>
              <Table.Td ta="right">{format.monetary(rest, account.currency)}</Table.Td>
              <Table.Td ta="right">
                <BudgetsTableActionCell
                  budget={{ value: budget.planned }}
                  onSetFormSubmit={handleSetFormSubmit}
                />
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Th>{t('BudgetsTable.totalText')}</Table.Th>
          <Table.Th ta="right">{format.monetary(total.planned, account.currency)}</Table.Th>
          <Table.Th ta="right" visibleFrom="xs">
            {format.monetary(total.expected, account.currency)}
            {!monetaryEqual(total.actual, total.expected) && (
              <Box>({format.monetary(total.actual, account.currency)})</Box>
            )}
          </Table.Th>
          <Table.Th ta="right">{format.monetary(total.rest, account.currency)}</Table.Th>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
};

const BudgetsTableActionCell = ({ budget, onSetFormSubmit }: {
  budget: BudgetFormValues,
  onSetFormSubmit: (data: BudgetFormValues) => Promise<void>
}) => {
  const [setOpened, { open: openSet, close: closeSet }] = useDisclosure(false);

  const handleSetFormSubmit = async (formValues: BudgetFormValues) => {
    await onSetFormSubmit(formValues);
    closeSet();
  };

  const t = useTranslations();

  return (
    <>
      <Modal
        opened={setOpened}
        onClose={closeSet}
        title={t('BudgetModal.setTitle')}
      >
        <BudgetForm
          budget={budget}
          onFormSubmit={handleSetFormSubmit}
        />
      </Modal>
      <ActionIcon variant="subtle" onClick={openSet}>
        <IconPencil size={14} />
      </ActionIcon>
    </>
  );
};
