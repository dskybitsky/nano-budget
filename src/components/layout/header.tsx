import {
  Avatar,
  Box,
  Burger, Divider,
  Flex,
  Group,
  Menu,
  Text,
  TextInput, TextProps, UnstyledButton,
} from '@mantine/core';
import { IconList, IconLogout, IconSearch } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { LayoutAccountsDto } from '@/actions/layout/layout-accounts';
import { useTranslations } from 'next-intl';
import { monetaryEqual } from '@/lib/utils';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { KeyboardEventHandler } from 'react';
import { redirect } from 'next/navigation';
import { accountsIndexUrl, accountTransactionsAllIndexUrl } from '@/lib/url';
import { useInputState } from '@mantine/hooks';
import classes from './header.module.css';

export interface HeaderProps {
  dto: LayoutAccountsDto,
  user: User,
  opened: boolean,
  toggle: () => void
}

export const Header = ({ dto, user, opened, toggle }: HeaderProps) => {
  const { currentAccount } = dto;

  const t = useTranslations();

  const [ search, setSearch ] = useInputState('');

  const handleSearchTextInputKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      setSearch('');
      redirect(accountTransactionsAllIndexUrl(currentAccount!.id, { name: search }));
    }
  };

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
        <TitleText account={currentAccount} flex="1" className={classes.accountTitle} />
        {currentAccount && (
          <>
            <BalanceText account={currentAccount} />
            <Divider orientation="vertical" />
          </>
        )}
        <Flex align="center" gap={16} flex="0">
          <TextInput
            visibleFrom="sm"
            radius="md"
            w={260}
            leftSection={<IconSearch size={14} />}
            placeholder="Search"
            onKeyDown={handleSearchTextInputKeyDown}
            onChange={setSearch}
            value={search}
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
                  <Menu.Item
                    leftSection={<IconList size={14} />}
                    component="a"
                    href={accountsIndexUrl()}
                  >{t('UserMenu.myAccounts')}</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={() => signOut()}
                  >
                    {t('UserMenu.logout')}
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

const TitleText = ({ account, ...props }: {
  account: LayoutAccountsDto['currentAccount'],
} & TextProps) => {
  const t = useTranslations();

  if (!account) {
    return (
      <Text fz={22} fw={800} {...props}>{t('Header.titleText')}</Text>
    );
  }

  return (
    <>
      <Text fz={22} fw={800} {...props} hiddenFrom="xs">
        {account.name}
      </Text>
      <Text fz={22} fw={800} {...props} visibleFrom="xs"  hiddenFrom="md">
        {t('Header.titleTextShort', { accountName: account.name })}
      </Text>
      <Text fz={22} fw={800} {...props} visibleFrom="md">
        {t('Header.titleTextLong', { accountName: account.name })}
      </Text>
    </>
  );
};

const BalanceText = ({ account, ...props }: {
  account: NonNullable<LayoutAccountsDto['currentAccount']>,
} & TextProps) => {
  const t = useTranslations();
  const format = useCustomFormatter();

  const useActualExpected = !monetaryEqual(account.balance.actual, account.balance.expected);

  const smallBalanceString = format.monetary(account.balance.actual, account.currency);

  const mediumBalanceString = useActualExpected
    ? t('Header.balanceActualExpectedTextShort', {
      actual: format.monetary(account.balance.actual, account.currency),
      expected: format.monetary(account.balance.expected, account.currency),
    }) : t('Header.balanceActualTextShort', {
      actual: format.monetary(account.balance.actual, account.currency),
    });

  const longBalanceString = useActualExpected
    ? t('Header.balanceActualExpectedTextLong', {
      actual: format.monetary(account.balance.actual, account.currency),
      expected: format.monetary(account.balance.expected, account.currency),
    }) : t('Header.balanceActualTextLong', {
      actual: format.monetary(account.balance.actual, account.currency),
    });

  return (
    <>
      <Text fz={16} fw={600} {...props} hiddenFrom="xs">{smallBalanceString}</Text>
      <Text fz={16} fw={600} {...props} visibleFrom="xs" hiddenFrom="md">{mediumBalanceString}</Text>
      <Text fz={16} fw={600} {...props} visibleFrom="md">{longBalanceString}</Text>
    </>
  );
};
