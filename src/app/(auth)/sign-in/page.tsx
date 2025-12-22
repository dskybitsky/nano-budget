import { SignInView } from '@/app/(auth)/sign-in/view';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return <SignInView />;
}
