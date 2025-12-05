import {
  Avatar,
  Box,
  Burger, Divider,
  Flex,
  Group, Menu, rem,
  Text,
  TextInput, TextProps, UnstyledButton,
} from '@mantine/core';
import { IconLogout, IconSearch, IconSettings } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { LayoutAccountsDto } from '@/actions/layout/layout-accounts';
import { useTranslations } from 'next-intl';
import { monetaryEqual } from '@/lib/utils';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

export interface HeaderProps {
  dto: LayoutAccountsDto,
  user: User,
  opened: boolean,
  toggle: () => void
}

export const Header = ({ dto, user, opened, toggle }: HeaderProps) => {
  const { currentAccount } = dto;

  return (
    <Flex
      h="100%"
      gap={10}
      w="100%"
      direction={{ base: 'row', md: 'column' }}
      align="center"
      px={20}
    >
      <Burger
        mr={10}
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
      />
      <Group
        w="100%"
        align="center"
        justify="space-between"
        py={10}
      >
        <TitleText account={currentAccount} useShort={true} fz={24} fw={800} hiddenFrom="md" flex="1" />
        <TitleText account={currentAccount} useShort={false} fz={24} fw={800} visibleFrom="md" flex="1" />
        {currentAccount && (
          <>
            <BalanceText account={currentAccount} useShort={true} hiddenFrom="md" />
            <BalanceText account={currentAccount} useShort={false} visibleFrom="md"/>
            <Divider orientation="vertical" />
          </>
        )}
        <Flex align="center" gap={24} flex="0">
          <TextInput
            visibleFrom="sm"
            radius="md"
            w={260}
            leftSection={<IconSearch size={14} />}
            placeholder="Search"
          />
          <Flex align="center" gap={8}>
            <Flex pos="relative">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton w="100%">
                    <Avatar size={34} alt={user.name ?? ''}>
                      {user.name?.substring(0, 1)}
                    </Avatar>
                    <Box
                      w={12}
                      h={12}
                      bg="green.4"
                      style={{
                        borderRadius: '50%',
                        border: '2px solid black',
                      }}
                      pos="absolute"
                      bottom={-2}
                      right={-2}
                    />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Preferences</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings style={{ width: rem(14), height: rem(14) }} />
                    }
                    component="a"
                    href="/settings"
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={() => signOut()}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Flex>
        </Flex>
      </Group>
    </Flex>
  );
};

const TitleText = ({ account, useShort, ...props }: {
  account: LayoutAccountsDto['currentAccount'],
  useShort?: boolean,
} & TextProps) => {
  const t = useTranslations();

  return (
    <Text fz={24} fw={800} {...props}>
      {
        account
          ? t(useShort ? 'Header.titleTextShort': 'Header.titleTextLong', { accountName: account.name })
          : t('Header.titleText')
      }
    </Text>
  );
};

const BalanceText = ({ account, useShort, ...props }: {
  account: NonNullable<LayoutAccountsDto['currentAccount']>,
  useShort?: boolean,
} & TextProps) => {
  const t = useTranslations();
  const format = useCustomFormatter();

  return (
    <Text fz={16} fw={600} {...props}>
      {
        monetaryEqual(account.balance.actual, account.balance.expected)
          ? t(useShort ? 'Header.balanceTextShort' : 'Header.balanceTextLong', {
            actual: format.monetary(account.balance.actual, account.currency),
          })
          : t(useShort ? 'Header.balanceFullTextShort' : 'Header.balanceFullTextLong', {
            actual: format.monetary(account.balance.actual, account.currency),
            expected: format.monetary(account.balance.expected, account.currency),
          })
      }
    </Text>
  );
};
