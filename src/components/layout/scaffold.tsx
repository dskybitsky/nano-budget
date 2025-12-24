'use client';

import React from 'react';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Header } from '@/components/layout/header';
import { Navbar } from '@/components/layout/navbar';
import { User } from 'next-auth';
import { LayoutAccountsDto } from '@/actions/layout/layout-accounts';

export interface ScaffoldProps extends React.HTMLAttributes<HTMLElement> {
  dto: LayoutAccountsDto,
  user: User,
}

export const Scaffold = ({ dto, user, children }: ScaffoldProps) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      withBorder={false}
      bg="gray.0"
    >
      <AppShell.Header bg="gray.0" withBorder={true}>
        <Header dto={dto} user={user} opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar bg="gray.0" p={10} hidden={true}>
        <Navbar dto={dto} onNavigate={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};
