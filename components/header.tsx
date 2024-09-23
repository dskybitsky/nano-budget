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
        <div className="flex items-center flex-wrap border-b gap-y-2 p-4">
            <AccountSwitcher className="mr-6" accounts={accounts} accountId={accountId} />
            <div className="mr-auto flex items-center space-x-4">
                {accountBalance && <Balance currency={currency} {...accountBalance} />}
            </div>
            <MainNav />
        </div>
    );
};
