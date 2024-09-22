'use client';

import * as React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteAccount } from '@/actions/account';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AccountDeleteDialogProps extends React.HTMLAttributes<HTMLElement> {
    accountId: string;
}

export const AccountDeleteDialog = ({ accountId, children }: AccountDeleteDialogProps) => {
    const router = useRouter();

    const onDeleteHandler = async () => {
        await deleteAccount(accountId);

        toast({
            description: 'Account deleted successfully.',
        });

        router.refresh();
    };

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDeleteHandler}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
