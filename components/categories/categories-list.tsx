'use client';

import { Category, OperationType } from '@prisma/client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { deleteCategory } from '@/actions/category';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DialogTrigger } from '@/components/ui/dialog';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { CategoryImage } from '@/components/categories/category-image';

interface CategoriesListProps extends React.HTMLAttributes<HTMLElement> {
    accountId: string;
    categories: Category[];
}

export const CategoriesList = ({ accountId, categories }: CategoriesListProps) => {
    const router = useRouter();

    const onDeleteHandler = async (id: string) => {
        await deleteCategory(id);

        toast({
            description: 'Category deleted successfully.',
        });

        router.refresh();
    };

    return (
        <div className="space-y-8">
            {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                    <CategoryImage category={category} className="h-9 w-9" />
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                            #{category.order}: {category.type === OperationType.credit && <span>Credit</span>}
                            {category.type === OperationType.debit && <span>Debit</span>} category.
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        <CategoryFormDialog accountId={accountId} category={category}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <DotsHorizontalIcon className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem onClick={() => onDeleteHandler(category.id)}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CategoryFormDialog>
                    </div>
                </div>
            ))}
        </div>
    );
};
