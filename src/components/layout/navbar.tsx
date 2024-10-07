import {
  Badge,
  Collapse,
  Divider,
  Flex,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  Avatar,
  useCombobox,
  Combobox, InputBase,
  Input,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingBank,
  IconCalendarDollar,
  IconChevronDown,
  IconChevronRight,
  IconHome2,
  IconReceipt,
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import Link from 'next/link';
import { LayoutViewDto } from '@/actions/layout-view';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Account } from '@prisma/client';

export interface NavbarProps {
  dto: LayoutViewDto,
  accountId?: string,
}

export const Navbar = ({ dto, accountId }: NavbarProps) => {
  const [transactionsOpened, { toggle: transactionsToggle }] = useDisclosure(true);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [, setValue] = useState<string | null>(accountId ?? null);

  const account = accountId
    ? dto.accountsById[accountId]
    : undefined;

  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Flex gap={8} w="100%" align="center">
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(val) => {
            setValue(val);
            combobox.closeDropdown();
            redirect(`/${val}/transactions`);
          }}
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
            >
              {account && (
                <AccountComboBoxItem account={account} />
              )}
              {!account && <Input.Placeholder>Choose account</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{
              dto.accounts.map((item) => (
                <Combobox.Option value={item.id} key={item.id}>
                  <AccountComboBoxItem account={item} />
                </Combobox.Option>
              ))
            }</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>


        {/*<Avatar size={50} alt="Account" color="black">A</Avatar>*/}
        {/*<Menu shadow="md" width={200}>*/}
        {/*  <Menu.Target>*/}
        {/*    <UnstyledButton w="100%">*/}
        {/*      <Flex w="100%" justify="space-between" align="start">*/}
        {/*        <Flex direction="column" align="start" gap={2}>*/}
        {/*          <Text className={classes.team}>Untitled UI Team</Text>*/}
        {/*          <Text fz={10} fw={400} c="gray">*/}
        {/*            shinthantequi@gmail.com*/}
        {/*          </Text>*/}
        {/*        </Flex>*/}
        {/*        <IconSelector size={18} />*/}
        {/*      </Flex>*/}
        {/*    </UnstyledButton>*/}
        {/*  </Menu.Target>*/}

        {/*  <Menu.Dropdown>*/}
        {/*    { dto.accounts.map((account) => {*/}
        {/*      return (*/}
        {/*        <Menu.Item*/}
        {/*          component="a"*/}
        {/*          href="/settings"*/}
        {/*        >*/}
        {/*          <Flex w="100%" justify="space-between" align="start">*/}
        {/*            <Flex direction="column" align="start" gap={2}>*/}
        {/*              <Text className={classes.team}>{account.name}</Text>*/}
        {/*              <Text fz={10} fw={400} c="gray">*/}
        {/*                {account.name}*/}
        {/*              </Text>*/}
        {/*            </Flex>*/}
        {/*            <IconSelector size={18} />*/}
        {/*          </Flex>*/}
        {/*        </Menu.Item>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*    <Menu.Label>Application</Menu.Label>*/}
        {/*    <Menu.Item*/}
        {/*      leftSection={*/}
        {/*        <IconSettings style={{ width: rem(14), height: rem(14) }} />*/}
        {/*      }*/}
        {/*    >*/}
        {/*      Settings*/}
        {/*    </Menu.Item>*/}
        {/*    <Menu.Item*/}
        {/*      leftSection={*/}
        {/*        <IconMessageCircle*/}
        {/*          style={{ width: rem(14), height: rem(14) }}*/}
        {/*        />*/}
        {/*      }*/}
        {/*    >*/}
        {/*      Messages*/}
        {/*    </Menu.Item>*/}

        {/*    <Menu.Divider />*/}

        {/*    <Menu.Label>Danger zone</Menu.Label>*/}

        {/*    <Menu.Item*/}
        {/*      color="red"*/}
        {/*      leftSection={*/}
        {/*        <IconTrash style={{ width: rem(14), height: rem(14) }} />*/}
        {/*      }*/}
        {/*    >*/}
        {/*      Delete my account*/}
        {/*    </Menu.Item>*/}
        {/*  </Menu.Dropdown>*/}
        {/*</Menu>*/}
      </Flex>

      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          <Flex w="100%" direction="column" align="start" key="nav-link-home">
            <NavLink icon={IconHome2} title="Home" link="/" />
          </Flex>
          <Divider my={10} w="100%" />
          {accountId && (
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
                    <Text className={classes.title} lts={-0.5}>Transactions</Text>
                  </Flex>
                  {transactionsOpened && <IconChevronDown />}
                  {!transactionsOpened && <IconChevronRight />}
                </UnstyledButton>
                <Collapse w="100%" pl={30} in={transactionsOpened}>
                  <Flex w="100%" py={14} direction="column" align="start" gap={10}>
                    <Link
                      key="nav-link-transactions-all"
                      className={classes.subNavLink}
                      href={`/${accountId}/transactions`}
                    >
                      <Text lts={-0.5}>All</Text>
                      <Badge radius={6} className={classes.noti} px={6}>10</Badge>
                    </Link>
                    <Link
                      key="nav-link-transactions-confirmed"
                      className={classes.subNavLink}
                      href={`/${accountId}/transactions?status=confirmed`}
                    >
                      <Text lts={-0.5}>Confirmed</Text>
                      <Badge radius={6} className={classes.noti} px={6}>9</Badge>
                    </Link>
                    <Link
                      key="nav-link-transactions-unconfirmed"
                      className={classes.subNavLink}
                      href={`/${accountId}/transactions?status=confirmed`}
                    >
                      <Text lts={-0.5}>Unconfirmed</Text>
                      <Badge radius={6} className={classes.noti} px={6}>1</Badge>
                    </Link>
                  </Flex>
                </Collapse>
              </Flex>
              <Flex w="100%" direction="column" align="start" key="nav-link-budget">
                <NavLink icon={IconCalendarDollar} title="Budget" link={`/${accountId}/budget`} />
              </Flex>
              <Divider my={10} w="100%" />
              <Flex w="100%" direction="column" align="start" key="nav-link-account">
                <NavLink icon={IconBuildingBank} title="Account" link={`/${accountId}`} />
              </Flex>
            </>
          )}
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

const AccountComboBoxItem = ({ account }: { account: Account }) => (
  <Flex w="100%" justify="start" align="center" gap={20} p={5}>
    <Avatar size={24} alt="Account" color="black">A</Avatar>
    <Flex direction="column" align="start" gap={2}>
      <Text className={classes.team}>{account.name}</Text>
      <Text fz={10} fw={400} c="gray">
        Description goes here
      </Text>
    </Flex>
  </Flex>
);

