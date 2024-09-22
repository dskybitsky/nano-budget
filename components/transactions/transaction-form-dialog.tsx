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
import { Category, Transaction } from '@prisma/client';

interface TransactionFormDialogProps extends React.HTMLAttributes<HTMLElement> {
    categories: Category[];
    transaction?: Transaction;
}

export const TransactionFormDialog = ({ categories, transaction, children }: TransactionFormDialogProps) => {
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
                    categories={categories}
                    transaction={transaction}
                    formElementId="transaction-form"
                    onValid={closeDialog}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type="submit" form="transaction-form">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
