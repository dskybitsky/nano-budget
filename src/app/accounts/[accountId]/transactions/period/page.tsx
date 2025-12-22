import React from 'react';
import { redirect } from 'next/navigation';
import { PeriodTransactionsView } from '@/app/accounts/[accountId]/transactions/period/view';
import { transactionsIndexPeriod } from '@/actions/transaction/transactions-index-period';
import { homeUrl } from '@/lib/url';

export default async function Page({ params, searchParams }: {
  params: Promise<{ accountId: string, periodId?: string }>,
  searchParams: Promise<{ [_: string]: string | undefined }>,
}) {
  const [{ accountId }, { periodId }] = await Promise.all([params, searchParams]);

  const dto = await transactionsIndexPeriod(accountId, periodId);

  if (!dto) {
    redirect(homeUrl());
  }

  return (<PeriodTransactionsView dto={dto} />);
}
