import React from 'react';
import { Account } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AccountImageProps extends React.HTMLAttributes<HTMLElement> {
    account: Account;
}

export const AccountImage = ({ account, className }: AccountImageProps) => {
    return (
        <Avatar className={cn(className, 'flex items-center justify-center space-y-0')}>
            <AvatarImage src={account.icon} alt="Account" />
            <AvatarFallback>{account.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
    );
};
