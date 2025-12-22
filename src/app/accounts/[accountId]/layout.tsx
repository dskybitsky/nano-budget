import React from 'react';

import { Scaffold } from '@/components/layout/scaffold';
import { getSessionUser } from '@/lib/auth';
import { layoutAccounts } from '@/actions/layout/layout-accounts';

export default async function layout({ params, children }: {
  params: Promise<{ accountId: string }>,
  children: React.ReactNode
}) {
  const { accountId } = await params;

  const user = await getSessionUser();
  const dto = await layoutAccounts(accountId);

  return (
    <Scaffold dto={dto} user={user}>
      {children}
    </Scaffold>
  );
}
