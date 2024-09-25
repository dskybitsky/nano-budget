import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { getAccountBalance, getAllAccounts } from '@/actions/account';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Nano Budget',
    description: 'Simple budgeting app.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;

    const accounts = await getAllAccounts();
    const accountBalance = accountId ? await getAccountBalance(accountId) : undefined;

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className="min-w-[380px]">
            <head>
                <link rel="icon" type="png" href="logo.png" />
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
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <div className="flex-col">
                            <Header accounts={accounts} accountId={accountId} accountBalance={accountBalance} />
                            {children}
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
};

export default RootLayout;
