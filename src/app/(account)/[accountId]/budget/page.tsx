import React from 'react';
import { redirect } from 'next/navigation';
import { budgetsIndex } from '@/actions/budget/budgets-index';
import { BudgetsView } from '@/app/(account)/[accountId]/budget/view';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>,
  searchParams: Promise<{ [_: string]: string | undefined }>,
}) {
  const [{ accountId }, { periodId }] = await Promise.all([params, searchParams]);

  const dto = await budgetsIndex(accountId, periodId);

  if (!dto) {
    redirect('/');
  }

  return (<BudgetsView dto={dto} periodId={periodId} />);
}
