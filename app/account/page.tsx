import { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriesList } from '@/components/categories/categories-list';
import { Button } from '@/components/ui/button';
import { CirclePlus, Trash } from 'lucide-react';
import * as React from 'react';
import { cookies } from 'next/headers';
import { DialogTrigger } from '@/components/ui/dialog';
import { viewAccount } from '@/actions/use-cases/view-account';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { Page } from '@/components/page';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AccountDeleteDialog } from '@/components/accounts/account-delete-dialog';
import { PeriodsTable } from '@/components/period/periods-table';
import { PeriodFormDialog } from '@/components/period/period-form-dialog';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { AccountCard } from '@/components/accounts/account-card';

export const metadata: Metadata = {
    title: 'Account',
    description: 'Update account details and properties.',
};

const AccountPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const accountId = cookies().get('accountId')?.value;
    const accountViewDto = accountId ? await viewAccount(accountId) : null;

    if (!accountId || !accountViewDto) {
        return (
            <Page title="Account">
                <div className="flex justify-center">
                    <span>Please choose an account.</span>
                </div>
            </Page>
        );
    }

    const { account, categories, periods } = accountViewDto;

    return (
        <Page title={account.name}>
            <div className="grid gap-4 grid-cols-6">
                <AccountCard className="col-span-6 sm:col-span-2" account={account} />
                <Card className="col-span-6 sm:col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between space-y-2">
                            <CardTitle>Manage Account Categories</CardTitle>
                            <div className="flex items-end space-x-2">
                                <CategoryFormDialog accountId={accountId}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <CirclePlus className="h-4 w-4" />
                                            <span className="hidden md:flex ml-2">Create Category</span>
                                        </Button>
                                    </DialogTrigger>
                                </CategoryFormDialog>
                            </div>
                        </div>
                        <CardDescription>Manage income and expense categories for the account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoriesList accountId={accountId} categories={categories} />
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>

                <Card className="col-span-6">
                    <CardHeader>
                        <div className="flex items-center justify-between space-y-2">
                            <CardTitle>Manage Account Periods</CardTitle>
                            <div className="flex items-end space-x-2">
                                <PeriodFormDialog accountId={accountId}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <CirclePlus className="h-4 w-4" />
                                            <span className="hidden sm:flex ml-2">Create Period</span>
                                        </Button>
                                    </DialogTrigger>
                                </PeriodFormDialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <PeriodsTable accountId={accountId} periods={periods} />
                    </CardContent>
                </Card>
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>Delete account and all its related data.</div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <AccountDeleteDialog accountId={accountId}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                        </AccountDeleteDialog>
                    </CardFooter>
                </Card>
            </div>
        </Page>
    );
};

export default AccountPage;
