'use client';

import { createContext, useContext } from 'react';
import { LayoutViewDto } from '@/actions/use-cases/view-layout';
import { Account } from '@prisma/client';
import { User } from 'next-auth';
import { WithBalance } from '@/types/balance';
import { AppInfo } from '@/types/app-info';

interface LayoutContext {
    collapsed: boolean;
    setCollapsed: () => void;
    dto: LayoutViewDto;
    account?: WithBalance<Account>;
    user?: User;
    appInfo?: AppInfo;
}

export const LayoutContext = createContext<LayoutContext>({
    collapsed: false,
    setCollapsed: () => {},
    dto: { accounts: [] },
});

export const useLayoutContext = () => {
    return useContext(LayoutContext);
};
