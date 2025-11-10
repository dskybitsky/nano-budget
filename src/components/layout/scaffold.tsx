'use client';

import React from 'react';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Header } from '@/components/layout/header';
import { Navbar } from '@/components/layout/navbar';
import classes from './scaffold.module.css';
import { User } from 'next-auth';
import { AccountLayoutDto } from '@/actions/account/account-layout';

export interface ScaffoldProps extends React.HTMLAttributes<HTMLElement> {
  dto: AccountLayoutDto,
  user: User,
  accountId?: string,
}

export const Scaffold = ({ dto, user, accountId, children }: ScaffoldProps) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      classNames={{
        root: classes.root,
        navbar: classes.navbar,
        header: classes.header,
        main: classes.main,
      }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Header user={user} opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar dto={dto} accountId={accountId} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
