import React from 'react';
import { Transactions } from '../../../components/main/transactions';
import { indexTransactions } from '@/actions/use-cases/index-transactions';

const page = async () => {
    const transactionsIndexDto = await indexTransactions();

    return <Transactions dto={transactionsIndexDto} />;
};

export default page;
