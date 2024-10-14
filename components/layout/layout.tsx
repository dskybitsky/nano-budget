'use client';

import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { NavbarWrapper } from '../navbar/navbar';
import { SidebarWrapper } from '../sidebar/sidebar';
import { LayoutContext } from './layout-context';
import { LayoutViewDto } from '@/actions/use-cases/view-layout';
import { Account } from '@prisma/client';
import { User } from 'next-auth';
import { WithBalance } from '@/types/balance';
import { AppInfo } from '@/types/app-info';

interface Props {
    children: React.ReactNode;
    dto: LayoutViewDto;
    account?: WithBalance<Account>;
    user?: User;
    appInfo?: AppInfo;
}

export const Layout = ({ children, dto, account, user, appInfo }: Props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [_, setLocked] = useLockedBody(false);
    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setLocked(!sidebarOpen);
    };

    return (
        <LayoutContext.Provider
            value={{
                collapsed: sidebarOpen,
                setCollapsed: handleToggleSidebar,
                dto,
                account,
                user,
                appInfo,
            }}
        >
            <section className="flex">
                <SidebarWrapper />
                <NavbarWrapper>{children}</NavbarWrapper>
            </section>
        </LayoutContext.Provider>
    );
};
