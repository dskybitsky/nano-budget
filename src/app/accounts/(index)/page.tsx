import React from 'react';
import { accountsIndex } from '@/actions/account/accounts-index';
import { AccountsView } from '@/app/accounts/(index)/view';

export default async function Page() {
  const dto = await accountsIndex();

  return (<AccountsView dto={dto} />);
}
