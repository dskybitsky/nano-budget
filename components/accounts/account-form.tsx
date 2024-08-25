'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Account, AccountType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useAccountForm } from '@/hooks/use-account-form';

const AccountFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    type: z.enum([AccountType.checking, AccountType.savings, AccountType.credit]),
    currency: z.string().max(5, { message: 'Currency can be maximum 5 characters.' }),
    value: z.coerce.number(),
    order: z.coerce.number(),
});

interface AccountFormProps {
    account?: Account;
    formElementId?: string;
    onValid?: () => void;
}

export const AccountForm = ({ account, formElementId, onValid }: AccountFormProps) => {
    const form = useAccountForm(account, {
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            name: account?.name ?? '',
            type: account?.type ?? AccountType.checking,
            currency: account?.currency ?? 'USD',
            value: account?.value ?? 0,
            order: account?.order ?? 0,
        },
    });

    const reset = form.reset;

    const onFormValid = () => {
        toast({
            description: account ? 'Account updated successfully.' : 'Account created successfully.',
        });

        if (onValid) {
            onValid();
        }
    };

    useEffect(() => reset(account), [reset, account]);

    return (
        <Form {...form}>
            <form id={formElementId} onSubmit={form.handleSubmit(onFormValid)}>
                <div className="space-y-4 py-2 pb-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My checking account." {...field} />
                                </FormControl>
                                <FormDescription>Name of your bank account.</FormDescription>
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
                                            <SelectValue placeholder="Select your accont type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={AccountType.checking}>Checking</SelectItem>
                                        <SelectItem value={AccountType.savings}>Savings</SelectItem>
                                        <SelectItem value={AccountType.credit}>Credit</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Type of your account. It will affect balance calculation and available operations.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <FormControl>
                                    <Input placeholder="USD" {...field} />
                                </FormControl>
                                <FormDescription>Currency of the account.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Initial balance</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" step="0.01" {...field} />
                                </FormControl>
                                <FormDescription>Initial account balance.</FormDescription>
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
                                <FormDescription>View (sorting) position of the account.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};
