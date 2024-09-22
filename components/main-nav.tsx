import Link from 'next/link';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const currentPath = usePathname();

    const linkBaseClassName = 'next-sm font-medium transition-colors hover:text-primary';
    const linkClassName = (path: string) =>
        path === currentPath ? linkBaseClassName : cn(linkBaseClassName, 'text-muted-foreground');

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
            <Link href="/" className={linkClassName('/')}>
                Overview
            </Link>
            <Link href="/transactions" className={linkClassName('/transactions')}>
                Transactions
            </Link>
            <Link href="/budget" className={linkClassName('/budget')}>
                Budget
            </Link>
            <Link href="/account" className={linkClassName('/account')}>
                Account
            </Link>
        </nav>
    );
}
