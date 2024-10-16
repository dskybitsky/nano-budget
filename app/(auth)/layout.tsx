import { AuthLayoutWrapper } from '@/components/auth/auth-layout-wrapper';
import '@/styles/globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
