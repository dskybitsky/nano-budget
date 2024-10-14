import React from 'react';
import { Sidebar } from './sidebar.styles';
import { AccountsDropdown } from './accounts-dropdown';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { BalanceIcon } from '../icons/sidebar/balance-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { ViewIcon } from '../icons/sidebar/view-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { useLayoutContext } from '../layout/layout-context';
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon';
import { usePathname } from 'next/navigation';
import { SidebarVersion } from '@/components/sidebar/sidebar-version';

export const SidebarWrapper = () => {
    const pathname = usePathname();

    const { collapsed, setCollapsed, appInfo } = useLayoutContext();

    return (
        <aside className="h-screen z-[20] sticky top-0">
            {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
            <div
                className={Sidebar({
                    collapsed: collapsed,
                })}
            >
                <div className={Sidebar.Header()}>
                    <AccountsDropdown />
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className={Sidebar.Body()}>
                        <SidebarItem title="Home" icon={<HomeIcon />} isActive={pathname === '/'} href="/" />
                        <SidebarMenu title="Main Menu">
                            <SidebarItem
                                isActive={pathname === '/accounts'}
                                title="Accounts"
                                icon={<AccountsIcon />}
                                href="accounts"
                            />
                            <SidebarItem
                                isActive={pathname === '/transactions'}
                                title="Transactions"
                                icon={<PaymentsIcon />}
                            />
                            <SidebarItem isActive={pathname === '/budget'} title="Budget" icon={<BalanceIcon />} />
                            <SidebarItem isActive={pathname === '/reports'} title="Reports" icon={<ReportsIcon />} />
                        </SidebarMenu>

                        <SidebarMenu title="Data">
                            <SidebarItem isActive={pathname === '/import'} title="Import" icon={<ViewIcon />} />
                            <SidebarItem isActive={pathname === '/settings'} title="Settings" icon={<SettingsIcon />} />
                        </SidebarMenu>

                        <SidebarMenu title="Updates">
                            <SidebarItem
                                isActive={pathname === '/changelog'}
                                title="Changelog"
                                icon={<ChangeLogIcon />}
                            />
                        </SidebarMenu>
                    </div>
                    <div className={Sidebar.Footer()}>{appInfo && <SidebarVersion {...appInfo} />}</div>
                </div>
            </div>
        </aside>
    );
};
