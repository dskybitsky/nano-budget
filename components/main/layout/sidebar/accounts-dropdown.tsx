'use client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { BottomIcon } from '../../../icons/sidebar/bottom-icon';
import { useMainLayoutContext } from '@/components/main/layout/main-layout-context';
import { Account } from '@prisma/client';
import { AccountDropdownImage } from '@/components/main/layout/sidebar/account-dropdown-image';
import { useRouter } from 'next/navigation';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { WithBalance } from '@/types/balance';
import { currencyRoundAbs } from '@/lib/utils';

export const AccountsDropdown = () => {
    const { dto, accountId } = useMainLayoutContext();

    const currentAccount = dto.accounts.find((a) => a.id === accountId);

    const [account, setAccount] = useState<WithBalance<Account> | undefined>(currentAccount);

    const [_, setCookie] = useCookies(['accountId']);

    const router = useRouter();

    const format = useCustomFormatter();

    return (
        <Dropdown
            classNames={{
                base: 'w-full min-w-[260px]',
            }}
        >
            <DropdownTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                    <div>{account && <AccountDropdownImage account={account} />}</div>
                    <div className="flex flex-col gap-4 max-w-[140px]">
                        <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {account?.name ?? 'Choose account'}
                        </h3>
                        <span className="text-xs font-medium text-default-500">
                            {account ? formatAccountBalance(format, account) : '-'}
                        </span>
                    </div>
                    <BottomIcon />
                </div>
            </DropdownTrigger>
            <DropdownMenu
                onAction={(accountId) => {
                    setAccount(dto.accounts.find((a) => a.id === accountId));
                    setCookie('accountId', accountId, { maxAge: 31536000 });
                    router.refresh();
                }}
                aria-label="Avatar Actions"
            >
                <DropdownSection title="Accounts">
                    {dto.accounts.map((account) => (
                        <DropdownItem
                            key={account.id}
                            startContent={<AccountDropdownImage account={account} />}
                            description={formatAccountBalance(format, account)}
                            classNames={{
                                base: 'py-4',
                                title: 'text-base font-semibold',
                            }}
                        >
                            {account.name}
                        </DropdownItem>
                    ))}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};

const formatAccountBalance = (format: ReturnType<typeof useCustomFormatter>, account: WithBalance<Account>): string => {
    let result = `Balance: ${format.narrowCurrency(account.balance.actual, account.currency)}`;

    if (currencyRoundAbs(account.balance.actual - account.balance.expected) > 0) {
        result = `${result} (→${format.narrowCurrency(account.balance.actual, account.currency)})`;
    }

    return result;
};
