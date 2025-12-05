import React from 'react';
import { redirect } from 'next/navigation';
import { PeriodicTransactionsView } from '@/app/accounts/[accountId]/transactions/periodic/view';
import { transactionsIndexPeriodic } from '@/actions/transaction/transactions-index-periodic';
import { homeUrl } from '@/lib/url';

export default async function Page({ params, searchParams }: {
  params: Promise<{ accountId: string, periodId?: string }>,
  searchParams: Promise<{ [_: string]: string | undefined }>,
}) {
  const [{ accountId }, { periodId }] = await Promise.all([params, searchParams]);

  const dto = await transactionsIndexPeriodic(accountId, periodId);

  if (!dto) {
    redirect(homeUrl());
  }

  return (<PeriodicTransactionsView dto={dto} />);
}
