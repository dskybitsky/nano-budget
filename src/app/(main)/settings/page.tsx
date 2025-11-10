import React from 'react';
import { homeUrl } from '@/lib/url';
import Link from 'next/link';

export default async function Page() {
  return (
    <>
      <p>Settings Page!</p>
      <Link href={homeUrl()}>Home</Link>
    </>
  );
}
