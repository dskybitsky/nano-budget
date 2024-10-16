import { Layout } from '@/components/layout/layout';
import '@/styles/globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { viewLayout } from '@/actions/use-cases/view-layout';
import { auth } from '@/lib/auth';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;

    const layoutViewDto = await viewLayout();

    const session = await auth();

    const appInfo = {
        name: 'Nano Budget',
        version: process.env.npm_package_version ?? '0.0.1',
    };

    return (
        <Layout dto={layoutViewDto} accountId={accountId} user={session?.user} appInfo={appInfo}>
            {children}
        </Layout>
    );
};

export default RootLayout;
