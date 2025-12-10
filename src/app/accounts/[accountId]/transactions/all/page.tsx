import React from 'react';
import { redirect } from 'next/navigation';
import { AllTransactionsView } from '@/app/accounts/[accountId]/transactions/all/view';
import { homeUrl } from '@/lib/url';
import { transactionsIndexAll } from '@/actions/transaction/transactions-index-all';
import { SearchParams } from '@/lib/types';
import { parseQueryBoolean, parseQueryDate, parseQueryPage } from '@/lib/utils';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>,
  searchParams: Promise<SearchParams>,
}) {
  const [{ accountId }, searchParamsResolved ] = await Promise.all([params, searchParams]);

  const {
    createdFrom,
    createdTo,
    executed,
    executedFrom,
    executedTo,
    page,
  } = parseSearchParams(searchParamsResolved);

  const filter = { createdFrom, createdTo, executed, executedFrom, executedTo };

  const dto = await transactionsIndexAll(accountId, filter, page);

  if (!dto) {
    redirect(homeUrl());
  }

  return (<AllTransactionsView dto={dto} filter={filter} page={page} />);
}

const parseSearchParams = (params: SearchParams) => ({
  createdFrom: parseQueryDate(params.createdFrom),
  createdTo: parseQueryDate(params.createdTo),
  executed: parseQueryBoolean(params.executed),
  executedFrom: parseQueryDate(params.executedFrom),
  executedTo: parseQueryDate(params.executedTo),
  page: parseQueryPage(params.page),
});
