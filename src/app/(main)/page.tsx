import { accountDefault } from '@/actions/account/account-default';
import { redirect } from 'next/navigation';
import { accountIndexUrl, accountViewUrl } from '@/lib/url';

export default async function Page() {
  const dto = await accountDefault();

  if (dto) {
    redirect(accountViewUrl(dto.id));
  } else {
    redirect(accountIndexUrl());
  }
}
