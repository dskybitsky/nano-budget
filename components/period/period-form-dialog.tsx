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
import { Period } from '@prisma/client';
import { PeriodForm } from '@/components/period/period-form';

interface PeriodFormDialogProps extends React.HTMLAttributes<HTMLElement> {
    accountId: string;
    period?: Period;
}

export const PeriodFormDialog = ({ accountId, period, children }: PeriodFormDialogProps) => {
    const [showDialog, setShowDialog] = React.useState(false);

    const closeDialog = () => setShowDialog(false);

    const title = period ? 'Edit Period' : 'Create Period';
    const description = period ? `Update period "${period.name}"` : 'Start new period';

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <PeriodForm accountId={accountId} period={period} formElementId="period-form" onValid={closeDialog} />
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type="submit" form="period-form">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
