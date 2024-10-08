'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category, OperationType } from '@prisma/client';
import { useCategoryForm } from '@/hooks/use-category-form';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';

const CategoryFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    type: z.enum([OperationType.debit, OperationType.credit]),
    icon: z.string().nullable(),
    order: z.coerce.number(),
});

interface CategoryFormProps {
    accountId: string;
    category?: Category;
    onValid?: () => void;
    buttonsRender?: (form: UseFormReturn<Category>) => React.ReactNode;
}

export const CategoryForm = ({ accountId, category, onValid, buttonsRender }: CategoryFormProps) => {
    const form = useCategoryForm(accountId, category, {
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: category?.name ?? '',
            type: category?.type ?? OperationType.credit,
            icon: category?.icon ?? '',
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

    buttonsRender ??= (form) => (
        <div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit
            </Button>
        </div>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormValid)}>
                <div className="space-y-4 py-2 pb-4">
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
                                        <SelectItem key={OperationType.debit} value={OperationType.debit}>
                                            Debit
                                        </SelectItem>
                                        <SelectItem key={OperationType.credit} value={OperationType.credit}>
                                            Credit
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="hidden sm:block">
                                    Choose default transaction type for the category - debit (&quot;income&quot;) or
                                    credit (&quot;expense&quot;).
                                </FormDescription>
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
                                <FormDescription className="hidden sm:block">Icon for the category.</FormDescription>
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
                {buttonsRender(form)}
            </form>
        </Form>
    );
};
