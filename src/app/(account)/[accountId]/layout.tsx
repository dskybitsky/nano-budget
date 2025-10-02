import React from 'react';

import { Scaffold } from '@/components/layout/scaffold';
import { getSessionUser } from '@/lib/auth';
import { layoutView } from '@/actions/layout-view';
import { redirect } from 'next/navigation';

export default async function layout({ params, children }: {
  params: Promise<{ accountId: string }>,
  children: React.ReactNode
}) {
  const { accountId } = await params;
  const user = await getSessionUser();
  const dto = await layoutView();

  if (!dto.accountsIndex[accountId]) {
    redirect('/');
  }

  return (
    <Scaffold dto={dto} user={user} accountId={accountId}>
      {children}
    </Scaffold>
  );
}
