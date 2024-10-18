'use client';

import * as React from 'react';

import { Account, Period } from '@prisma/client';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { cn, Pagination, PaginationItemRenderProps, PaginationItemType } from '@nextui-org/react';
import { ChevronIcon } from '@nextui-org/shared-icons';

interface PeriodSwitcherProps {
    account: Account;
    periods: Period[];
    periodId?: string;
}

export default function PeriodSwitcher({ account, periods, periodId }: PeriodSwitcherProps) {
    const cookieName = `${account.id}_periodId`;

    const [, setCookie] = useCookies([cookieName]);

    const router = useRouter();

    const currentPeriodIndex = periods.findIndex((p) => p.id === periodId);

    const renderItem = ({
        ref,
        key,
        value,
        isActive,
        onNext,
        onPrevious,
        setPage,
        className,
    }: PaginationItemRenderProps) => {
        if (value === PaginationItemType.NEXT) {
            return (
                <button key={key} className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')} onClick={onNext}>
                    <ChevronIcon className="rotate-180" />
                </button>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <button key={key} className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')} onClick={onPrevious}>
                    <ChevronIcon />
                </button>
            );
        }

        if (value === PaginationItemType.DOTS) {
            return (
                <button key={key} className={className}>
                    ...
                </button>
            );
        }

        // cursor is the default item
        return (
            <button
                key={key}
                ref={ref}
                className={cn(
                    className,
                    isActive && 'text-white bg-primary-100 font-bold rounded-xl',
                    'w-fit pl-6 pr-6',
                )}
                onClick={() => setPage(value)}
            >
                {periods[value - 1].name}
            </button>
        );
    };

    return (
        <Pagination
            disableCursorAnimation
            showControls
            total={periods.length}
            initialPage={currentPeriodIndex + 1}
            boundaries={1}
            className="gap-4"
            radius="full"
            renderItem={renderItem}
            variant="light"
            onChange={(page) => {
                setCookie(cookieName, periods[page - 1].id, { maxAge: 31536000 });
                router.refresh();
            }}
        />
    );
}
