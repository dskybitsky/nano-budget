import { MainLayout } from '@/components/main/layout';
import '@/styles/globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { viewLayout } from '@/actions/use-cases/view-layout';
import { auth } from '@/lib/auth';

const layout = async ({ children }: { children: React.ReactNode }) => {
    const accountId = cookies().get('accountId')?.value;
    const periodId = cookies().get(`${accountId}_periodId`)?.value;

    const layoutViewDto = await viewLayout();

    const session = await auth();

    const appInfo = {
        name: 'Nano Budget',
        version: process.env.npm_package_version ?? '0.0.1',
    };

    return (
        <MainLayout
            dto={layoutViewDto}
            accountId={accountId}
            periodId={periodId}
            user={session?.user}
            appInfo={appInfo}
        >
            {children}
        </MainLayout>
    );
};

export default layout;
