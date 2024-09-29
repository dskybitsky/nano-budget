'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Account, Category, Transaction } from '@prisma/client';

interface TransactionFormDialogProps extends React.HTMLAttributes<HTMLElement> {
    account: Account;
    categories: Category[];
    transaction?: Transaction;
}

export const TransactionFormDialog = ({ account, categories, transaction, children }: TransactionFormDialogProps) => {
    const [showDialog, setShowDialog] = React.useState(false);

    const closeDialog = () => setShowDialog(false);

    const title = transaction ? 'Update Transaction' : 'Create Transaction';
    const description = transaction
        ? `Change transaction "${transaction.name}" details`
        : 'Enter new transaction details';

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <TransactionForm
                    account={account}
                    categories={categories}
                    transaction={transaction}
                    onValid={closeDialog}
                    buttonsRender={(form) => (
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={form.formState.isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Submit
                            </Button>
                        </DialogFooter>
                    )}
                />
            </DialogContent>
        </Dialog>
    );
};
