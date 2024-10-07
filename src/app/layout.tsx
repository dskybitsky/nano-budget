import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import './global.css';
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
        <link rel="shortcut icon" href="/favicon.svg" />
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
