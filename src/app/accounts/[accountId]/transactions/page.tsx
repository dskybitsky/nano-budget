import React from 'react';
import { transactionsIndex } from '@/actions/transaction/transactions-index';
import { redirect } from 'next/navigation';
import { TransactionsView } from '@/app/accounts/[accountId]/transactions/view';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>,
  searchParams: Promise<{ [_: string]: string | undefined }>,
}) {
  const [{ accountId }, {
    periodId,
    executed,
    executedFrom,
    executedTo,
  }] = await Promise.all([params, searchParams]);

  const filter = createFilter(executed, executedFrom, executedTo);

  const dto = await transactionsIndex(accountId, periodId, filter);

  if (!dto) {
    redirect('/');
  }

  return (<TransactionsView dto={dto} filter={filter} />);
}

const createFilter = (executed: unknown, executedFrom: unknown, executedTo: unknown) => {
  return {
    executed: (
      executed === 'true'
        ? true
        : (executed === 'false' ? false : undefined)
    ),
    executedFrom: parseFilterDate(executedFrom),
    executedTo: parseFilterDate(executedTo),
  };
};

const parseFilterDate = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};
