import { Layout } from '@/components/layout/layout';
import '@/styles/globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { viewLayout } from '@/actions/use-cases/view-layout';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;

    const layoutViewDto = await viewLayout(accountId);

    const account = accountId ? layoutViewDto.accounts.find((a) => a.id === accountId) : undefined;

    return (
        <Layout dto={layoutViewDto} account={account}>
            {children}
        </Layout>
    );
};

export default RootLayout;
