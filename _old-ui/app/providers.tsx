// 'use client';

import { NextUIProvider } from '@nextui-org/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const Providers = async ({ children }: { children: React.ReactNode }) => {
    const messages = await getMessages();

    return (
        <NextUIProvider>
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
                {children}
            </NextIntlClientProvider>
        </NextUIProvider>
    );
};
