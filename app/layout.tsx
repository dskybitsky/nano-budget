import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import NextThemeProvider from '@/components/next-theme-provider';
import { viewLayout } from '@/actions/use-cases/view-layout';

export const metadata: Metadata = {
    title: 'Nano Budget',
    description: 'Simple budgeting app.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;

    const layoutViewDto = await viewLayout(accountId);

    const { accounts, accountBalance } = layoutViewDto;

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html suppressHydrationWarning={true} lang={locale} className="min-w-[380px]">
            <head>
                <title>Nano Budget</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body>
                <NextIntlClientProvider
                    messages={messages}
                    formats={{
                        dateTime: {
                            short: {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: 'numeric',
                                hourCycle: 'h23',
                            },
                        },
                        number: {
                            precise: {
                                maximumFractionDigits: 5,
                            },
                        },
                        list: {
                            enumeration: {
                                style: 'long',
                                type: 'conjunction',
                            },
                        },
                    }}
                >
                    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <div className="flex-col">
                            <Header accounts={accounts} accountId={accountId} accountBalance={accountBalance} />
                            {children}
                        </div>
                        <Toaster />
                    </NextThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
};

export default RootLayout;
