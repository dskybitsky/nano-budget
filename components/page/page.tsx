import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { UsersIcon } from '@/components/icons/breadcrumb/users-icon';
import React from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

export const Page = ({ title, children }: Props) => {
    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon />
                    <Link href={'/'}>
                        <span>Home</span>
                    </Link>
                    <span> / </span>{' '}
                </li>

                <li className="flex gap-2">
                    <UsersIcon />
                    <span>Users</span>
                    <span> / </span>{' '}
                </li>
                <li className="flex gap-2">
                    <span>List</span>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">{title}</h3>
            {children}
        </div>
    );
};
