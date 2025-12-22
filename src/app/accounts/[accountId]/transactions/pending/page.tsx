import React from 'react';
import { redirect } from 'next/navigation';
import { transactionsIndexPending } from '@/actions/transaction/transactions-index-pending';
import { homeUrl } from '@/lib/url';
import { PendingTransactionsView } from '@/app/accounts/[accountId]/transactions/pending/view';

export default async function Page({ params }: {
  params: Promise<{ accountId: string }>
}) {
  const { accountId } = await params;

  const dto = await transactionsIndexPending(accountId);

  if (!dto) {
    redirect(homeUrl());
  }

  return (<PendingTransactionsView dto={dto} />);
}

