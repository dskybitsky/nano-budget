import React from 'react';
import { AccountView } from '@/app/(account)/[accountId]/view';
import { accountView } from '@/actions/account/account-view';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Account',
};

export default async function Page({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  const dto = await accountView(accountId);

  if (!dto) {
    redirect('/');
  }

  return <AccountView dto={dto}/>;
}
