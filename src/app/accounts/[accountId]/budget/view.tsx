'use client';

import { Box, Flex } from '@mantine/core';
import React from 'react';
import { redirect } from 'next/navigation';
import { accountBudgetIndexUrl } from '@/lib/url';
import { PeriodPicker } from '@/components/period/period-picker';
import { Period } from '@prisma/client';
import { BudgetsIndexDto } from '@/actions/budget/budgets-index';
import { BudgetFormValues } from '@/components/budget/budget-form';
import { budgetSet } from '@/actions/budget/budget-set';
import { BudgetsTable } from '@/components/budget/budgets-table';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';
import { IconCalendarDollar } from '@tabler/icons-react';

export interface BudgetsViewProps extends React.HTMLAttributes<HTMLElement> {
  dto: BudgetsIndexDto,
}

export const BudgetsView = ({ dto }: BudgetsViewProps) => {
  const t = useTranslations();

  const handleSetFormSubmit = async (categoryId: string, formValues: BudgetFormValues) => {
    await budgetSet(categoryId, dto.periodId, formValues);
  };

  const handlePeriodChange = (period: Period) => {
    redirect(accountBudgetIndexUrl(dto.account.id, period.id));
  };

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction="column"
      align="center"
    >
      <PageHeader
        title={t('BudgetsIndex.title')}
        leftSection={<IconCalendarDollar size={36} />}
        bottomSection={
          <>
            <Box/>
            <PeriodPicker periods={dto.periods} periodId={dto.periodId} onChange={handlePeriodChange} />
          </>
        }
      />
      <BudgetsTable
        account={dto.account}
        categories={dto.categories}
        budgetsByCategory={dto.periodBudgetsByCategory}
        total={dto.periodTotal}
        onSetFormSubmit={handleSetFormSubmit}
      />
    </Flex>
  );
};
