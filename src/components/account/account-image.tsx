import React from 'react';
import { Account } from '@prisma/client';
import { Avatar, AvatarProps } from '@mantine/core';

interface AccountImageProps extends AvatarProps {
  account: Account;
}

export const AccountImage = ({ account, ...props }: AccountImageProps) => {
  const icon = account.icon ?? null;

  return (
    <Avatar src={icon} alt={account.name} {...props}>
      {account.name.substring(0, 2)}
    </Avatar>
  );
};
