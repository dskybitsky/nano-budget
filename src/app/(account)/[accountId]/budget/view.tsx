'use client';

import { Box, Flex } from '@mantine/core';
import React from 'react';
import { redirect } from 'next/navigation';
import { createTransactionsPageUrl } from '@/lib/url';
import { PeriodPicker } from '@/components/period/period-picker';
import { Period } from '@prisma/client';
import { BudgetsIndexDto } from '@/actions/budget/budgets-index';
import { BudgetFormValues } from '@/components/budget/budget-form';
import { budgetSet } from '@/actions/budget/budget-set';
import { BudgetsTable } from '@/components/budget/budgets-table';

export interface BudgetsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: BudgetsIndexDto,
  periodId?: string,
}

export const BudgetsView = ({ dto, periodId }: BudgetsViewProps) => {
  const handleSetFormSubmit = async (categoryId: string, periodId: string, formValues: BudgetFormValues) => {
    await budgetSet(categoryId, periodId, formValues);
  };

  const handlePeriodChange = (period: Period) => {
    redirect(createTransactionsPageUrl(dto.account.id, {
      createdFrom: period.started,
      createdTo: period.ended ?? undefined,
    }));
  };

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <Flex gap={20} w="100%" justify="space-between" align="center">
        <PeriodPicker periods={dto.periods} periodId={periodId} onChange={handlePeriodChange} />
      </Flex>
      <Box w="100%" mt="md">
        <BudgetsTable
          account={dto.account}
          categories={dto.categories}
          budgets={dto.budgets}
          onSetFormSubmit={handleSetFormSubmit}
        />
      </Box>
    </Flex>
  );
};
