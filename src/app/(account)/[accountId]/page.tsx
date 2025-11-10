import React from 'react';
import { Metadata } from 'next';
import { AccountView } from '@/app/(account)/[accountId]/view';
import { accountView } from '@/actions/account/account-view';
import { redirect } from 'next/navigation';
import { homeUrl } from '@/lib/url';

export const metadata: Metadata = {
  title: 'Account',
};

export default async function Page({ params }: {
  params: Promise<{ accountId: string }>
}) {
  const { accountId } = await params;

  const dto = await accountView(accountId);

  if (!dto) {
    redirect(homeUrl());
  }

  return <AccountView dto={dto} />;
}
