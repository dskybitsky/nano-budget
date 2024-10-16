import React from 'react';
import { Transactions } from '@/components/transactions';
import { indexTransactions } from '@/actions/use-cases/index-transactions';

const TransactionsPage = async () => {
    const transactionsIndexDto = await indexTransactions();

    return <Transactions dto={transactionsIndexDto} />;
};

export default TransactionsPage;
