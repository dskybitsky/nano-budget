'use client';
import { Button, Input } from '@nextui-org/react';
import React from 'react';
import { DotsIcon } from '@/components/icons/accounts/dots-icon';
import { ExportIcon } from '@/components/icons/accounts/export-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { TrashIcon } from '@/components/icons/accounts/trash-icon';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { AddUser } from './add-user';
import { TransactionsIndexDto } from '@/actions/use-cases/index-transactions';
import { TransactionsTable } from '@/components/transactions/table';
import { Page } from '@/components/page/page';

interface TransactionsProps {
    dto: TransactionsIndexDto;
}

export const Transactions = ({ dto }: TransactionsProps) => {
    if ('error' in dto) {
        switch (dto.error) {
            case 'account-missing':
                return (
                    <Page title="Transactions">
                        <span>Please choose account</span>
                    </Page>
                );

            case 'period-missing':
                return (
                    <Page title="Transactions">
                        <span>Please choose period</span>
                    </Page>
                );
        }
    }

    return (
        <Page title="Transactions">
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <Input
                        classNames={{
                            input: 'w-full',
                            mainWrapper: 'w-full',
                        }}
                        placeholder="Search users"
                    />
                    <SettingsIcon />
                    <TrashIcon />
                    <InfoIcon />
                    <DotsIcon />
                </div>
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <AddUser />
                    <Button color="primary" startContent={<ExportIcon />}>
                        Export to CSV
                    </Button>
                </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <TransactionsTable dto={dto} />
            </div>
        </Page>
    );
};
