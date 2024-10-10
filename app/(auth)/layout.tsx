import { AuthLayoutWrapper } from '@/components/auth/auth-layout-wrapper';
import '@/styles/globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    console.log('layout');
    return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
