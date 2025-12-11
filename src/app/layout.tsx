import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import './global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';

export const metadata = {
  title: {
    template: 'Nano Budget | %s',
    default: 'Nano Budget',
  },
  description: 'Basic budgeting and spending tracker app',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title.default}</title>
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <MantineProvider theme={theme}>
            <ModalsProvider>
              {children}
            </ModalsProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
