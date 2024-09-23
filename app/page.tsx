import { Metadata } from 'next';

import { Page } from '@/components/page';
import { getServerSession } from 'next-auth';
import { redirect, useRouter } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Example dashboard app built using the components.',
};

const DashboardPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <Page title="Nano Budget">
            <span>Dashboard will go here</span>
        </Page>
    );
};

export default DashboardPage;
