import {
  Badge,
  Collapse,
  Divider,
  Flex,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useCombobox,
  Combobox,
  InputBase,
  Input,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingBank,
  IconCalendarDollar,
  IconChevronDown,
  IconChevronRight,
  IconList,
  IconReceipt,
  IconSettings,
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import Link from 'next/link';
import { AccountLayoutDto } from '@/actions/account/account-layout';
import { redirect, useSearchParams } from 'next/navigation';
import {
  accountCreateUrl,
  accountViewUrl,
  accountBudgetIndexUrl,
  settingsUrl,
  accountTransactionsIndexUrl,
  accountIndexUrl,
} from '@/lib/url';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { useTranslations } from 'next-intl';
import { EntityImage } from '@/components/entity-image';

export interface NavbarProps {
  dto: AccountLayoutDto,
  accountId?: string,
}

export const Navbar = ({ dto, accountId }: NavbarProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [transactionsOpened, { toggle: transactionsToggle }] = useDisclosure(true);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleAccountComboboxOptionSubmit = (value: string) => {
    combobox.closeDropdown();

    if (value.length === 0) {
      redirect(accountIndexUrl());
    }

    redirect(accountTransactionsIndexUrl(value));
  };

  const account = dto.accounts.find((account) => account.id === accountId);

  const periodId = searchParams.get('periodId');

  const periodSummary = (
    periodId
      ? account?.summary[periodId]
      : account?.summary.last
  ) ?? {
    count: 0,
    executedCount: 0,
    nonExecutedCount: 0,
  };

  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Flex gap={8} w="100%" align="center">
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={handleAccountComboboxOptionSubmit}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}
              rightSectionPointerEvents="none"
              w="100%"
              styles={{ input: { height: 'auto' } }}
              disabled={dto.accounts.length === 0}
            >
              {account && (
                <AccountComboBoxItem account={account} />
              )}
              {!account && <Input.Placeholder>{t('Navbar.accountPlaceholder')}</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {dto.accounts.map((item) => (
                <Combobox.Option value={item.id} key={`account-option-${item.id}`}>
                  <AccountComboBoxItem account={item} />
                </Combobox.Option>
              ))}
              <Divider w="100%" />
              <Combobox.Option value={''} key='account-option-index'>
                <AccountsIndexComboBoxItem />
              </Combobox.Option>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Flex>
      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          {accountId && (
            <>
              <NavLink
                icon={IconBuildingBank}
                title="Account"
                link={accountId ? accountViewUrl(accountId) : accountCreateUrl()}
              />
              <Divider my={10} w="100%" />
              <Flex direction="column" align="start" w="100%">
                <UnstyledButton
                  h={36.15}
                  style={{
                    justifyContent: 'space-between',
                  }}
                  w="100%"
                  className={classes.navLink}
                  onClick={transactionsToggle}
                >
                  <Flex align="center" gap={10}>
                    <IconReceipt size={20} />
                    <Text className={classes.title} lts={-0.5}>{t('Navbar.transactionsItem')}</Text>
                  </Flex>
                  {transactionsOpened && <IconChevronDown />}
                  {!transactionsOpened && <IconChevronRight />}
                </UnstyledButton>
                <Collapse w="100%" pl={30} in={transactionsOpened}>
                  <Flex w="100%" py={14} direction="column" align="start" gap={10}>
                    <Link
                      key="nav-link-transactions-all"
                      className={classes.subNavLink}
                      href={accountTransactionsIndexUrl(accountId)}
                    >
                      <Text lts={-0.5}>{t('Navbar.allTransactionsItem')}</Text>
                      <Badge radius={6} className={classes.noti} px={6}>{periodSummary.count}</Badge>
                    </Link>
                    <Link
                      key="nav-link-transactions-confirmed"
                      className={classes.subNavLink}
                      href={accountTransactionsIndexUrl(accountId, undefined, { executed: true })}
                    >
                      <Text lts={-0.5}>{t('Navbar.executedTransactionsItem')}</Text>
                      <Badge radius={6} className={classes.noti} px={6}>
                        {periodSummary.executedCount}
                      </Badge>
                    </Link>
                    <Link
                      key="nav-link-transactions-unconfirmed"
                      className={classes.subNavLink}
                      href={accountTransactionsIndexUrl(accountId, undefined, { executed: false })}
                    >
                      <Text lts={-0.5}>{t('Navbar.nonExecutedTransactionsItem')}</Text>
                      <Badge
                        radius={6}
                        className={classes.noti}
                        px={6}
                        bg={ periodSummary.nonExecutedCount > 0 ? 'red.3' : ''}
                      >
                        {periodSummary.nonExecutedCount}
                      </Badge>
                    </Link>
                  </Flex>
                </Collapse>
              </Flex>
              <Flex w="100%" direction="column" align="start" key="nav-link-budget">
                <NavLink icon={IconCalendarDollar} title="Budget" link={accountBudgetIndexUrl(accountId)} />
              </Flex>
              <Divider my={10} w="100%" />
            </>
          )}
          <Flex w="100%" direction="column" align="start" key="nav-link-settings">
            <NavLink icon={IconSettings} title="Settings" link={settingsUrl()} />
          </Flex>
        </Flex>
      </ScrollArea>
      <Flex w="100%" direction="column" align="center" gap={6}>
        <Text size="xs">Nano Budget v.0.2-wip</Text>
      </Flex>
    </Stack>
  );
};

interface NavLinkProps {
  icon: React.ElementType;
  title: string;
  link: string;
}

const NavLink = ({ title, icon: Icon, link }: NavLinkProps) => {
  return (
    <Link className={classes.navLink} href={link}>
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {title}
      </Text>
    </Link>
  );
};

const AccountComboBoxItem = ({ account }: { account: AccountLayoutDto['accounts'][number] }) => {
  const t = useTranslations();
  const format = useCustomFormatter();

  return (
    <Flex w="100%" justify="start" align="center" gap={20} p={5}>
      <EntityImage size={36} entity={account} />
      <Flex direction="column" align="start" gap={2}>
        <Text className={classes.accountTitle}>{account.name}</Text>
        <Text fz={12} fw={400} c="gray">
          {t('Navbar.accountDescriptionPlaceholder', {
            accountType: t('Enum.AccountType', { value: account.type }) })
          }
        </Text>
        <Text fz={12} fw={400}>
          {
            t('Navbar.accountBalanceText', {
              actual: format.monetary(account.balance.actual, account.currency),
            })
          }
        </Text>
      </Flex>
    </Flex>
  );
};

const AccountsIndexComboBoxItem = () => {
  const t = useTranslations();

  return (
    <Flex w="100%" justify="center" align="center" gap={10} p={5}>
      <IconList size={20} />
      <Text fz={14}>{t('Navbar.allAccountsItem')}</Text>
    </Flex>
  );
};

