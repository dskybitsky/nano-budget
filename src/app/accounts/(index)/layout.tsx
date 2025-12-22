import React from 'react';

import { Scaffold } from '@/components/layout/scaffold';
import { getSessionUser } from '@/lib/auth';
import { layoutAccounts } from '@/actions/layout/layout-accounts';

export default async function layout({ children }: {
  children: React.ReactNode
}) {
  const user = await getSessionUser();
  const dto = await layoutAccounts();

  return (
    <Scaffold dto={dto} user={user}>
      {children}
    </Scaffold>
  );
}
