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
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <AccountSwitcher accounts={accounts} accountId={accountId} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    {accountBalance && <Balance currency={currency} {...accountBalance} />}
                </div>
            </div>
        </div>
    );
};
