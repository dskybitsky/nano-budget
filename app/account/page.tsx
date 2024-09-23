import { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriesList } from '@/components/categories/categories-list';
import { Button } from '@/components/ui/button';
import { CirclePlus, Trash } from 'lucide-react';
import * as React from 'react';
import { cookies } from 'next/headers';
import { AccountForm } from '@/components/accounts/account-form';
import { DialogTrigger } from '@/components/ui/dialog';
import { viewAccount } from '@/actions/use-cases/view-account';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { Page } from '@/components/page';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AccountDeleteDialog } from '@/components/accounts/account-delete-dialog';
import { PeriodsTable } from '@/components/period/periods-table';
import { PeriodFormDialog } from '@/components/period/period-form-dialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between space-y-2">
                            <CardTitle>Manage Account Categories</CardTitle>
                            <div className="flex items-end space-x-2">
                                <CategoryFormDialog accountId={accountId}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <CirclePlus className="mr-2 h-4 w-4" />
                                            Create Category
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
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Change Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AccountForm account={account} formElementId="card-account-update-form" />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" form="card-account-update-form">
                            Update
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="col-span-6">
                    <CardHeader>
                        <div className="flex items-center justify-between space-y-2">
                            <CardTitle>Manage Account Periods</CardTitle>
                            <div className="flex items-end space-x-2">
                                <PeriodFormDialog accountId={accountId}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <CirclePlus className="mr-2 h-4 w-4" />
                                            Create Period
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
