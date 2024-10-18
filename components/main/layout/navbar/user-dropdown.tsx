import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Navbar,
    NavbarItem,
    User,
} from '@nextui-org/react';
import React, { useCallback } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import { logout } from '@/actions/auth';
import { useMainLayoutContext } from '@/components/main/layout/main-layout-context';

export const UserDropdown = () => {
    const handleLogout = useCallback(async () => {
        await logout();
    }, []);

    const { user } = useMainLayoutContext();

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Avatar
                        as="button"
                        color="secondary"
                        size="md"
                        src="https://avatars.githubusercontent.com/u/30373425?v=4"
                    />
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="User menu actions" onAction={(actionKey) => console.log({ actionKey })}>
                <DropdownSection showDivider>
                    <DropdownItem isReadOnly key="profile" className="flex flex-col justify-start w-full items-start">
                        <User
                            name={user?.name}
                            description={user?.email}
                            classNames={{
                                name: 'text-default-600',
                                description: 'text-default-500',
                            }}
                            avatarProps={{
                                size: 'sm',
                                src: 'https://avatars.githubusercontent.com/u/30373425?v=4',
                            }}
                        />
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection showDivider>
                    <DropdownItem key="preferences">Preferences</DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
                        Log Out
                    </DropdownItem>
                </DropdownSection>
                <DropdownItem key="switch">
                    <DarkModeSwitch />
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
