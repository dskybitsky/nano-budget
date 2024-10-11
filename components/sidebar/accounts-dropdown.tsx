'use client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { BottomIcon } from '../icons/sidebar/bottom-icon';
import { useLayoutContext } from '@/components/layout/layout-context';
import { Account } from '@prisma/client';
import { AccountDropdownImage } from '@/components/sidebar/account-dropdown-image';
import { useRouter } from 'next/navigation';

export const AccountsDropdown = () => {
    const { dto, account: contextAccount } = useLayoutContext();

    const [account, setAccount] = useState<Account | undefined>(contextAccount);

    const [_, setCookie] = useCookies(['accountId']);

    const router = useRouter();

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
                        <span className="text-xs font-medium text-default-500">Description here</span>
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
                            description={account.type}
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
