import { Metadata } from 'next';

import { Page } from '@/components/page';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Example dashboard app built using the components.',
};

export default function DashboardPage() {
    return (
        <Page title="Nano Budget">
            <span>Dashboard will go here</span>
        </Page>
    );
}
