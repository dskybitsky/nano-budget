'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category, CategoryType } from '@prisma/client';
import { useCategoryForm } from '@/hooks/use-category-form';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CategoryFormSchema = z.object({
    type: z.enum([CategoryType.debit, CategoryType.credit]),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    icon: z.string().nullable(),
    color: z.string().nullable(),
    order: z.coerce.number(),
});

interface CategoryFormProps {
    accountId: string;
    category?: Category;
    formElementId?: string;
    onValid?: () => void;
}

export const CategoryForm = ({ accountId, category, formElementId, onValid }: CategoryFormProps) => {
    const form = useCategoryForm(accountId, category, {
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            type: category?.type ?? CategoryType.credit,
            name: category?.name ?? '',
            icon: category?.icon ?? '',
            color: category?.color ?? '',
            order: category?.order ?? 0,
        },
    });

    const reset = form.reset;

    const onFormValid = () => {
        toast({
            description: category ? 'Category updated successfully.' : 'Category created successfully.',
        });

        if (onValid) {
            onValid();
        }
    };

    useEffect(() => reset(category), [reset, category]);

    return (
        <Form {...form}>
            <form id={formElementId} onSubmit={form.handleSubmit(onFormValid)}>
                <div className="space-y-4 py-2 pb-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transaction type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem key={CategoryType.debit} value={CategoryType.debit}>
                                            Debit
                                        </SelectItem>
                                        <SelectItem key={CategoryType.credit} value={CategoryType.credit}>
                                            Credit
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="hidden sm:block">
                                    Choose the transaction type - debit (&quot;income&quot;) or credit
                                    (&quot;expense&quot;).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="New category" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">Name of the category.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <FormControl>
                                    <Input placeholder="URL" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">Icon of the category.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="#000000" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">Color of the category.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>View Order</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" step="1" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    View (sorting) position of the category.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};
