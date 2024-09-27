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
import { CategoryForm } from '@/components/categories/category-form';
import { Category } from '@prisma/client';

interface CategoryFormDialogProps extends React.HTMLAttributes<HTMLElement> {
    accountId: string;
    category?: Category;
}

export const CategoryFormDialog = ({ accountId, category, children }: CategoryFormDialogProps) => {
    const [showDialog, setShowDialog] = React.useState(false);

    const closeDialog = () => setShowDialog(false);

    const title = category ? 'Edit Category' : 'Create Category';
    const description = category ? `Change category "${category.name}" parameters` : 'Enter new category details';

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <CategoryForm
                    accountId={accountId}
                    category={category}
                    formElementId="category-form"
                    onValid={closeDialog}
                />
                <DialogFooter className="gap-y-2">
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type="submit" form="category-form">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
