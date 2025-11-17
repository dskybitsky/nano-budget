import {
  Avatar,
  Box,
  Burger,
  Flex,
  Group, Menu, rem,
  Text,
  TextInput, UnstyledButton,
} from '@mantine/core';
import { IconLogout, IconSearch, IconSettings } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { User } from 'next-auth';

export interface HeaderProps {
  user: User,
  opened: boolean,
  toggle: () => void
}

export const Header = ({ user, opened, toggle }: HeaderProps) => {
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
        <Text fz={24} fw={800}>
          Nano Budget
        </Text>
        <Flex align="center" gap={24}>
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
