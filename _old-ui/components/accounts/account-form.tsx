'use client';

import * as React from 'react';

import { Input } from '@/_old-ui/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/_old-ui/components/ui/form';
import { Account, AccountType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_old-ui/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useAccountForm } from '@/hooks/use-account-form';
import { Button } from '@/_old-ui/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { CurrencyInput } from '@/_old-ui/components/ui/currency-input';

const AccountFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    type: z.enum([AccountType.checking, AccountType.savings, AccountType.credit]),
    currency: z.string().max(5, { message: 'Currency can be maximum 5 characters.' }),
    value: z.coerce.number(),
    icon: z.string().nullable(),
    order: z.coerce.number(),
});

interface AccountFormProps {
    account?: Account;
    onValid?: () => void;
    buttonsRender?: (form: UseFormReturn<Account>) => React.ReactNode;
}

export const AccountForm = ({ account, onValid, buttonsRender }: AccountFormProps) => {
    const form = useAccountForm(account, {
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            name: account?.name ?? '',
            type: account?.type ?? AccountType.checking,
            currency: account?.currency ?? 'USD',
            value: account?.value ?? 0,
            icon: account?.icon ?? '',
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
                                    <Input placeholder="My checking account." {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Name of your bank account.
                                </FormDescription>
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
                                <FormDescription className="hidden sm:block">
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
                                <FormDescription className="hidden sm:block">Currency of the account.</FormDescription>
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
                                    <CurrencyInput placeholder="0.00" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">Initial account balance.</FormDescription>
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
                                <FormDescription className="hidden sm:block">Icon for the account.</FormDescription>
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
                                    View (sorting) position of the account.
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
