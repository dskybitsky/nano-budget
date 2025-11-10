import React from 'react';

import { Scaffold } from '@/components/layout/scaffold';
import { getSessionUser } from '@/lib/auth';
import { accountLayout } from '@/actions/account/account-layout';

export default async function layout({ params, children }: {
  params: Promise<{ accountId: string }>,
  children: React.ReactNode
}) {
  const { accountId } = await params;

  const user = await getSessionUser();
  const dto = await accountLayout();

  return (
    <Scaffold dto={dto} user={user} accountId={accountId}>
      {children}
    </Scaffold>
  );
}
