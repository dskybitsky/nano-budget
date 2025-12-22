'use client';

import { createContext, ReactNode } from 'react';
import { AppInfo } from '@/lib/types';

export const AppContext = createContext<AppInfo>({ });

export const AppContextProvider = ({ appInfo, children }: {
  appInfo: AppInfo,
  children: ReactNode
}) => {
  return (<AppContext.Provider value={appInfo}>{children}</AppContext.Provider>);
};
