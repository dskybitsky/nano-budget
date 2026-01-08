import { accountDefault } from '@/actions/account/account-default';
import { redirect } from 'next/navigation';
import { accountsIndexUrl, accountTransactionsPeriodIndexUrl } from '@/lib/url';

export default async function Page() {
  const dto = await accountDefault();

  if (dto) {
    redirect(accountTransactionsPeriodIndexUrl(dto.id));
  } else {
    redirect(accountsIndexUrl());
  }
}
