import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { Header } from '@/_old-ui/components/header';
import { Toaster } from '@/_old-ui/components/ui/toaster';
import { getLocale } from 'next-intl/server';
import { viewLayout } from '@/actions/use-cases/view-layout';
import { Providers } from '@/_old-ui/app/providers';

export const metadata: Metadata = {
    title: 'Nano Budget',
    description: 'Simple budgeting app.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;

    const layoutViewDto = await viewLayout(accountId);

    const { accounts, accountBalance } = layoutViewDto;

    const locale = await getLocale();

    return (
        <html suppressHydrationWarning={true} lang={locale} className="min-w-[380px]">
            <head>
                <title>Nano Budget</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </head>
            <body>
                <Providers>
                    <div className="flex-col">
                        <Header accounts={accounts} accountId={accountId} accountBalance={accountBalance} />
                        {children}
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
