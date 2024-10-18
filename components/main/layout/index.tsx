'use client';

import React from 'react';
import { NavbarWrapper } from '@/components/main/layout/navbar/navbar';
import { SidebarWrapper } from '@/components/main/layout/sidebar/sidebar';
import { MainLayoutContext } from './main-layout-context';
import { LayoutViewDto } from '@/actions/use-cases/view-layout';
import { User } from 'next-auth';
import { AppInfo } from '@/types/app-info';
import { useLockedBody } from '@/hooks/use-body-lock';

interface Props {
    children: React.ReactNode;
    dto: LayoutViewDto;
    accountId?: string;
    periodId?: string;
    user?: User;
    appInfo?: AppInfo;
}

export const MainLayout = ({ children, dto, accountId, periodId, user, appInfo }: Props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [_, setLocked] = useLockedBody(false);
    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setLocked(!sidebarOpen);
    };

    return (
        <MainLayoutContext.Provider
            value={{
                collapsed: sidebarOpen,
                setCollapsed: handleToggleSidebar,
                dto,
                accountId,
                periodId,
                user,
                appInfo,
            }}
        >
            <section className="flex">
                <SidebarWrapper />
                <NavbarWrapper>{children}</NavbarWrapper>
            </section>
        </MainLayoutContext.Provider>
    );
};
