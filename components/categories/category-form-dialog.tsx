'use client';

import * as React from 'react';

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
import { Button } from '@/components/ui/button';

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
