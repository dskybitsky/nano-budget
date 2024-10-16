import React from 'react';
import { Transactions } from '@/components/transactions';
import { cookies } from 'next/headers';
import { indexTransactions } from '@/actions/use-cases/index-transactions';

const TransactionsPage = async () => {
    const accountId = cookies().get('accountId')?.value;
    const periodId = cookies().get(`${accountId}_periodId`)?.value;

    const transactionsIndexDto = accountId ? await indexTransactions(accountId, periodId) : null;

    return <Transactions dto={transactionsIndexDto} accountId={accountId} periodId={periodId} />;
};

export default TransactionsPage;
