import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarItem } from '@nextui-org/react';
import React, { useCallback } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import { logout } from '@/actions/auth';
import { useLayoutContext } from '@/components/layout/layout-context';
import { CollectionElement } from '@react-types/shared';

export const UserDropdown = () => {
    const handleLogout = useCallback(async () => {
        await logout();
    }, []);

    const { user } = useLayoutContext();

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Avatar
                        as="button"
                        color="secondary"
                        size="md"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="User menu actions" onAction={(actionKey) => console.log({ actionKey })}>
                <DropdownItem key="profile" className="flex flex-col justify-start w-full items-start">
                    <p>Signed in as</p>
                    <p>{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="preferences">Preferences</DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
                    Log Out
                </DropdownItem>
                <DropdownItem key="switch">
                    <DarkModeSwitch />
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
