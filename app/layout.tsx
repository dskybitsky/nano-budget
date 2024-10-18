import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import React from 'react';
import { IntlClientProvider } from '@/components/providers/intl-client-provider';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Nano Budget',
    description: 'Simple Budget and Expense Tracker',
};

const layout = async ({ children }: { children: React.ReactNode }) => {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={clsx('font-sans antialiased', fontSans.className)}>
                <IntlClientProvider locale={locale} messages={messages}>
                    <Providers>{children}</Providers>
                </IntlClientProvider>
            </body>
        </html>
    );
};

export default layout;
