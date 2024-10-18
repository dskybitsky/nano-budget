'use client';

import { createContext, useContext } from 'react';
import { LayoutViewDto } from '@/actions/use-cases/view-layout';
import { User } from 'next-auth';
import { AppInfo } from '@/types/app-info';

interface MainLayoutContext {
    collapsed: boolean;
    setCollapsed: () => void;
    dto: LayoutViewDto;
    accountId?: string;
    periodId?: string;
    user?: User;
    appInfo?: AppInfo;
}

export const MainLayoutContext = createContext<MainLayoutContext>({
    collapsed: false,
    setCollapsed: () => {},
    dto: { accounts: [] },
});

export const useMainLayoutContext = () => {
    return useContext(MainLayoutContext);
};
