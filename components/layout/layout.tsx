'use client';

import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { NavbarWrapper } from '../navbar/navbar';
import { SidebarWrapper } from '../sidebar/sidebar';
import { LayoutContext } from './layout-context';
import { LayoutViewDto } from '@/actions/use-cases/view-layout';
import { Account } from '@prisma/client';
import { User } from 'next-auth';

interface Props {
    children: React.ReactNode;
    dto: LayoutViewDto;
    account?: Account;
    user?: User;
}

export const Layout = ({ children, dto, account, user }: Props) => {
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
            }}
        >
            <section className="flex">
                <SidebarWrapper />
                <NavbarWrapper>{children}</NavbarWrapper>
            </section>
        </LayoutContext.Provider>
    );
};
