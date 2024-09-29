'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Budget } from '@prisma/client';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useBudgetForm } from '@/hooks/use-budget-form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const BudgetFormSchema = z.object({
    value: z.coerce.number().min(0, { message: 'Value cannot be less than zero.' }),
});

interface BudgetFormProps {
    periodId: string;
    categoryId: string;
    budget?: Budget;
    onValid?: () => void;
    buttonsRender?: (form: UseFormReturn<Budget>) => React.ReactNode;
}

export const BudgetForm = ({ periodId, categoryId, budget, onValid, buttonsRender }: BudgetFormProps) => {
    const form = useBudgetForm(categoryId, periodId, budget, {
        resolver: zodResolver(BudgetFormSchema),
        defaultValues: {
            value: budget?.value ?? 0,
        },
    });

    const reset = form.reset;

    const onFormValid = () => {
        toast({
            description: 'Budget updated successfully.',
        });

        if (onValid) {
            onValid();
        }
    };

    useEffect(() => reset(budget), [reset, budget]);

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
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" placeholder="Amount" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Budget total planned amount.
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
