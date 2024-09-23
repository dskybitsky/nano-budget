import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import * as React from 'react';
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { DialogTrigger } from '@/components/ui/dialog';
import { indexTransactions } from '@/actions/use-cases/index-transactions';
import { Page } from '@/components/page';
import PeriodSwitcher from '@/components/period/period-switcher';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

const TransactionsPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const accountId = cookies().get('accountId')?.value;
    const periodId = cookies().get(`${accountId}_periodId`)?.value;

    const transactionsIndexDto = accountId ? await indexTransactions(accountId, periodId) : null;

    if (!accountId || !transactionsIndexDto) {
        return (
            <Page title="Transactions">
                <div className="flex justify-center p-8">
                    <span>Please choose an account to see the transactions.</span>
                </div>
            </Page>
        );
    }

    const { account, periods, categories, period, periodTransactions } = transactionsIndexDto;

    if (!periods.length) {
        return (
            <Page title="Transactions">
                <div className="flex justify-center p-8">
                    <span>Please create a period to add transactions.</span>
                </div>
            </Page>
        );
    }

    if (!period || !periodTransactions) {
        return (
            <Page title="Transactions">
                <div className="flex justify-end items-end w-full">
                    <PeriodSwitcher account={account} periods={periods} />
                </div>
                <div className="flex justify-center p-8">
                    <span>Please choose a period to see the transaction.</span>
                </div>
            </Page>
        );
    }

    return (
        <Page
            title="Transactions"
            sideBlock={
                <div>
                    <TransactionFormDialog categories={categories}>
                        <DialogTrigger asChild>
                            <Button>
                                <CirclePlus className="mr-2 h-4 w-4" />
                                <span>Create Transaction</span>
                            </Button>
                        </DialogTrigger>
                    </TransactionFormDialog>
                </div>
            }
        >
            <div className="flex justify-end items-end w-full">
                <PeriodSwitcher account={account} periods={periods} periodId={periodId} />
            </div>
            <TransactionsTable
                account={account}
                categories={categories}
                period={period}
                periodTransactions={periodTransactions}
            />
        </Page>
    );
};

export default TransactionsPage;
