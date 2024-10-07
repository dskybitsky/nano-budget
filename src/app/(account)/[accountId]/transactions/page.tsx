import React from 'react';
import { transactionsIndex } from '@/actions/transaction/transactions-index';
import { redirect } from 'next/navigation';
import { TransactionsView } from '@/app/(account)/[accountId]/transactions/view';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>,
  searchParams: Promise<{ [_: string]: string | string[] | undefined }>,
}) {
  const [{ accountId }, { createdFrom, createdTo }] = await Promise.all([params, searchParams]);

  const filter = createFilter(createdFrom, createdTo);

  const dto = await transactionsIndex(accountId, filter);

  if (!dto) {
    redirect('/');
  }

  return (<TransactionsView dto={dto} filter={filter} />);
}

const createFilter = (createdFrom: unknown, createdTo: unknown) => {
  return {
    createdFrom: parseFilterDate(createdFrom),
    createdTo: parseFilterDate(createdTo),
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
