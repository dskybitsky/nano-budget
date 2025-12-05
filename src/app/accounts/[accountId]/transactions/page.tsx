import { redirect } from 'next/navigation';
import { accountTransactionsPeriodicIndexUrl, homeUrl } from '@/lib/url';

export default async function Page({ params }: {
  params: Promise<{ accountId: string, periodId?: string }>
}) {
  const { accountId, periodId } = await params;

  if (!accountId) {
    redirect(homeUrl());
  }

  redirect(accountTransactionsPeriodicIndexUrl(accountId, periodId));
}
