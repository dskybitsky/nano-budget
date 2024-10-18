import React from 'react';
import { Account } from '@prisma/client';
import { Avatar } from '@nextui-org/react';
import clsx from 'clsx';

interface AccountDropdownImageProps extends React.HTMLAttributes<HTMLElement> {
    account: Account;
}

export const AccountDropdownImage = ({ account, className }: AccountDropdownImageProps) => {
    return <Avatar showFallback radius="sm" src={account.icon} name={account.name} className={clsx('', className)} />;
};
