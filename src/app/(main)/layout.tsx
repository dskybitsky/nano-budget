import React from 'react';

import { Scaffold } from '@/components/layout/scaffold';
import { getSessionUser } from '@/lib/auth';
import { layoutView } from '@/actions/layout-view';

export default async function layout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const dto = await layoutView();

  return (
    <Scaffold dto={dto} user={user}>
      {children}
    </Scaffold>
  );
}
