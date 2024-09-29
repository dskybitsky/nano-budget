'use client';

import { MainNav } from '@/components/main-nav';
import { Account } from '@prisma/client';
import { AccountSwitcher } from '@/components/accounts/account-switcher';
import { Balance } from '@/components/balance';

interface HeaderProps {
    accounts: Account[];
    accountId?: string;
    accountBalance?: {
        actual: number;
        expected: number;
    };
}

export const Header = ({ accounts, accountId, accountBalance }: HeaderProps) => {
    const currency = accounts.find((a) => a.id === accountId)?.currency ?? 'USD';

    return (
        <div className="flex items-center flex-wrap sm:flex-nowrap border-b gap-y-4 p-4">
            <AccountSwitcher className="mr-6" accounts={accounts} accountId={accountId} />
            <MainNav className="order-2 sm:order-1" />
            {accountBalance && (
                <div className="ml-auto pl-0 sm:pl-4 flex items-center space-x-4 order-1 sm:order-2">
                    <Balance currency={currency} {...accountBalance} />
                </div>
            )}
        </div>
    );
};
