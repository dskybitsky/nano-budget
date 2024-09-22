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
import { Budget } from '@prisma/client';
import { BudgetForm } from '@/components/budget/budget-form';

interface BudgetFormDialogProps extends React.HTMLAttributes<HTMLElement> {
    periodId: string;
    categoryId: string;
    budget?: Budget;
}

export const BudgetFormDialog = ({ periodId, categoryId, budget, children }: BudgetFormDialogProps) => {
    const [showDialog, setShowDialog] = React.useState(false);

    const closeDialog = () => setShowDialog(false);

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Budget</DialogTitle>
                    <DialogDescription>Set category budget for the period.</DialogDescription>
                </DialogHeader>
                <BudgetForm
                    periodId={periodId}
                    categoryId={categoryId}
                    budget={budget}
                    formElementId="budget-form"
                    onValid={closeDialog}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type="submit" form="budget-form">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
