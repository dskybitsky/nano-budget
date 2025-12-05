import React from 'react';
import { redirect } from 'next/navigation';
import { AllTransactionsView } from '@/app/accounts/[accountId]/transactions/all/view';
import { homeUrl } from '@/lib/url';
import { transactionsIndexAll } from '@/actions/transaction/transactions-index-all';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>,
  searchParams: Promise<{ [_: string]: string | undefined }>,
}) {
  const [{ accountId }, {
    createdFrom,
    createdTo,
    executed,
    executedFrom,
    executedTo,
  }] = await Promise.all([params, searchParams]);

  const filter = createFilter(createdFrom, createdTo, executed, executedFrom, executedTo);

  const dto = await transactionsIndexAll(accountId, filter);

  if (!dto) {
    redirect(homeUrl());
  }

  return (<AllTransactionsView dto={dto} filter={filter} />);
}

const createFilter = (
  createdFrom: unknown,
  createdTo: unknown,
  executed: unknown,
  executedFrom: unknown,
  executedTo: unknown,
) => {
  return {
    createdFrom: parseFilterDate(createdFrom),
    createdTo: parseFilterDate(createdTo),
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
