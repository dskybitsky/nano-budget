'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountForm } from '@/components/accounts/account-form';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { Account } from '@prisma/client';

interface AccountCardProps extends React.HTMLAttributes<HTMLElement> {
    account: Account;
}

export const AccountCard = ({ className, account }: AccountCardProps) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Change Account Details</CardTitle>
            </CardHeader>
            <CardContent>
                <AccountForm
                    account={account}
                    buttonsRender={(form) => (
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            Update
                        </Button>
                    )}
                />
            </CardContent>
        </Card>
    );
};
