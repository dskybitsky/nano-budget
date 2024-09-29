'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Period } from '@prisma/client';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePeriodForm } from '@/hooks/use-period-form';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const PeriodFormSchema = z.object({
    started: z.date(),
    ended: z.date().nullish(),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
});

interface PeriodFormProps {
    accountId: string;
    period?: Period;
    onValid?: () => void;
    buttonsRender?: (form: UseFormReturn<Period>) => React.ReactNode;
}

export const PeriodForm = ({ accountId, period, onValid, buttonsRender }: PeriodFormProps) => {
    const form = usePeriodForm(accountId, period, {
        resolver: zodResolver(PeriodFormSchema),
        defaultValues: {
            name: period?.name ?? '',
            started: period?.started ?? new Date(),
            ended: period?.ended,
        },
    });

    const reset = form.reset;

    const onFormValid = () => {
        toast({
            description: period ? 'Period updated successfully.' : 'Period created successfully.',
        });

        if (onValid) {
            onValid();
        }
    };

    useEffect(() => reset(period), [reset, period]);

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
                                    <Input placeholder="New period" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">Name of the new period.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="started"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Started</FormLabel>
                                <FormControl>
                                    <DateTimePicker value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Date when the period starts.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ended"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ended</FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        resettable
                                        value={field.value ?? undefined}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Date when the period ends.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="entity"
                        render={() => (
                            <FormItem>
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
