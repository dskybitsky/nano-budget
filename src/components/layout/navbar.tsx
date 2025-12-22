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
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  accountCreateUrl,
  accountViewUrl,
  accountBudgetIndexUrl,
  accountTransactionsPeriodIndexUrl,
  accountTransactionsPendingIndexUrl,
  accountTransactionsAllIndexUrl,
  accountIndexUrl,
} from '@/lib/url';
import { useTranslations } from 'next-intl';
import { EntityImage } from '@/components/entity-image';
import { LayoutAccountsDto } from '@/actions/layout/layout-accounts';
import { useContext } from 'react';
import { AppContext } from '@/components/app-context';

export interface NavbarProps {
  dto: LayoutAccountsDto,
  onNavigate?: () => void,
}

export const Navbar = ({ dto, onNavigate }: NavbarProps) => {
  const t = useTranslations();

  const appContext = useContext(AppContext);

  const [transactionsOpened, { toggle: transactionsToggle }] = useDisclosure(true);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleAccountComboboxOptionSubmit = (value: string) => {
    combobox.closeDropdown();

    if (value.length === 0) {
      redirect(accountIndexUrl());
    }

    redirect(accountTransactionsPeriodIndexUrl(value));
  };

  const { currentAccount } = dto;

  const transactionsCount = currentAccount?.transactionsCount;

  return (
    <Stack h="100%" gap={20} px="md" py="lg" bg="white" bd="1px solid gray.2" bdrs={10}>
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
              {currentAccount && (
                <AccountComboBoxItem account={currentAccount} />
              )}
              {!currentAccount && <Input.Placeholder>{t('Navbar.accountPlaceholder')}</Input.Placeholder>}
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
          {currentAccount && (
            <>
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
                      href={accountTransactionsPeriodIndexUrl(currentAccount.id)}
                      onNavigate={onNavigate}
                    >
                      <Text lts={-0.5}>{t('Navbar.transactionsLastPeriodItem')}</Text>
                      {transactionsCount?.period !== undefined && (
                        <Badge radius={6} className={classes.noti} px={6}>{transactionsCount.period}</Badge>
                      )}
                    </Link>
                    <Link
                      key="nav-link-transactions-confirmed"
                      className={classes.subNavLink}
                      href={accountTransactionsPendingIndexUrl(currentAccount.id)}
                      onNavigate={onNavigate}
                    >
                      <Text lts={-0.5}>{t('Navbar.transactionsPendingItem')}</Text>
                      {transactionsCount?.pending !== undefined && (
                        <Badge
                          radius={6}
                          className={classes.noti}
                          px={6}
                          bg={ transactionsCount.pending > 0 ? 'red.3' : ''}
                        >{transactionsCount?.pending}</Badge>
                      )}
                    </Link>
                    <Link
                      key="nav-link-transactions-unconfirmed"
                      className={classes.subNavLink}
                      href={accountTransactionsAllIndexUrl(currentAccount.id)}
                      onNavigate={onNavigate}
                    >
                      <Text lts={-0.5}>{t('Navbar.transactionsAllItem')}</Text>
                      {transactionsCount?.all !== undefined && (
                        <Badge radius={6} className={classes.noti} px={6}>{transactionsCount?.all}</Badge>
                      )}
                    </Link>
                  </Flex>
                </Collapse>
              </Flex>
              <Flex w="100%" direction="column" align="start" key="nav-link-budget">
                <NavLink
                  icon={IconCalendarDollar}
                  title="Budget"
                  link={accountBudgetIndexUrl(currentAccount.id)}
                  onNavigate={onNavigate}
                />
              </Flex>
              <Divider my={10} w="100%" />
              <NavLink
                icon={IconBuildingBank}
                title="Account"
                link={currentAccount ? accountViewUrl(currentAccount.id) : accountCreateUrl()}
                onNavigate={onNavigate}
              />
            </>
          )}
        </Flex>
      </ScrollArea>
      <Divider />
      <Flex w="100%" direction="column" align="center" gap={6}>
        <Text size="xs">Nano Budget v.{appContext.version}</Text>
      </Flex>
    </Stack>
  );
};

interface NavLinkProps {
  icon: React.ElementType,
  title: string,
  link: string,
  onNavigate?: () => void,
}

const NavLink = ({ title, icon: Icon, link, onNavigate }: NavLinkProps) => {
  return (
    <Link className={classes.navLink} href={link} onNavigate={onNavigate}>
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {title}
      </Text>
    </Link>
  );
};

const AccountComboBoxItem = ({ account }: { account: LayoutAccountsDto['accounts'][number] }) => {
  const t = useTranslations();

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
      </Flex>
    </Flex>
  );
};

const AccountsIndexComboBoxItem = () => {
  const t = useTranslations();

  return (
    <Flex w="100%" justify="start" align="center" gap={20} p={5}>
      <Flex w={36} align="center" justify="center">
        <IconList size={24} />
      </Flex>
      <Flex direction="column" align="start" gap={2}>
        <Text className={classes.accountTitle}>{t('Navbar.allAccountsItem')}</Text>
      </Flex>
    </Flex>
  );
};

