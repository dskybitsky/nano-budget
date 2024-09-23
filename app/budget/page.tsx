import { Metadata } from 'next';

import * as React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { indexBudget } from '@/actions/use-cases/index-budget';
import { Page } from '@/components/page';
import PeriodSwitcher from '@/components/period/period-switcher';
import { BudgetTable } from '@/components/budget/budget-table';
import { authOptions } from '@/lib/authOptions';

export const metadata: Metadata = {
    title: 'Budget',
    description: 'Current account budget.',
};

const BudgetPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const accountId = cookies().get('accountId')?.value;
    const periodId = cookies().get(`${accountId}_periodId`)?.value;

    const budgetIndexDto = accountId ? await indexBudget(accountId, periodId) : null;

    if (!accountId || !budgetIndexDto) {
        return (
            <Page title="Budget">
                <div className="flex justify-center p-8">
                    <span>Please choose an account to set up the budget.</span>
                </div>
            </Page>
        );
    }

    const { account, periods, categories, period, periodBudgets, periodTransactionSums } = budgetIndexDto;

    if (!periods.length) {
        return (
            <Page title="Budget">
                <div className="flex justify-center p-8">
                    <span>Please create a period to set up the budget.</span>
                </div>
            </Page>
        );
    }

    if (!period || !periodBudgets || !periodTransactionSums) {
        return (
            <Page title="Budget">
                <div className="flex justify-end items-end w-full">
                    <PeriodSwitcher account={account} periods={periods} />
                </div>
                <div className="flex justify-center p-8">
                    <span>Please choose a period to set up the budget.</span>
                </div>
            </Page>
        );
    }

    return (
        <Page title="Budget">
            <div className="flex justify-end items-end w-full">
                <PeriodSwitcher account={account} periods={periods} periodId={periodId} />
            </div>
            <div className="flex justify-center p-8">
                <BudgetTable
                    account={account}
                    categories={categories}
                    period={period}
                    periodBudgets={periodBudgets}
                    periodTransactionSums={periodTransactionSums}
                />
            </div>
        </Page>
    );
};

export default BudgetPage;
