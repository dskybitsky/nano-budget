'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Account, AccountType, Category, Transaction, OperationType } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionForm } from '@/hooks/use-transaction-form';
import { useEffect } from 'react';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { useCookies } from 'react-cookie';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CategoryImage } from '@/components/categories/category-image';
import { CurrencyInput } from '@/components/ui/currency-input';

const TransactionFormSchema = z.object({
    categoryId: z.string(),
    created: z.date(),
    executed: z.date().nullish(),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    type: z.enum([OperationType.debit, OperationType.credit]),
    value: z.coerce.number().gt(0, 'Must be greater than zero'),
});

interface TransactionFormProps {
    account: Account;
    categories: Category[];
    transaction?: Transaction;
    onValid?: () => void;
    buttonsRender?: (form: UseFormReturn<Transaction>) => React.ReactNode;
}

export const TransactionForm = ({ account, categories, transaction, onValid, buttonsRender }: TransactionFormProps) => {
    const lastCategoryCookieName = `${account.id}_last_cat`;

    const [cookies, setCookie] = useCookies([lastCategoryCookieName]);

    const categoriesIndex = categories.reduce((acc, category) => {
        acc.set(category.id, category);

        return acc;
    }, new Map<string, Category>());

    const lastCategory = categoriesIndex.get(cookies[lastCategoryCookieName]);

    const form = useTransactionForm(transaction, {
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: {
            categoryId: transaction?.categoryId ?? lastCategory?.id,
            created: transaction?.created ?? new Date(),
            executed: transaction?.executed ?? (account.type === AccountType.credit ? null : new Date()),
            name: transaction?.name ?? '',
            type: transaction?.type ?? lastCategory?.type ?? OperationType.credit,
            value: transaction?.value ?? 0,
        },
    });

    const reset = form.reset;

    const onFormValid = () => {
        toast({
            description: transaction ? 'Transaction updated successfully.' : 'Transaction created successfully.',
        });

        if (onValid) {
            onValid();
        }
    };

    useEffect(() => reset(transaction), [reset, transaction]);

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
                <div className="grid gap-x-4 grid-cols-6 space-y-4 py-2 pb-4">
                    <FormField
                        control={form.control}
                        name="created"
                        render={({ field }) => (
                            <FormItem className="col-span-6">
                                <FormLabel>Created</FormLabel>
                                <FormControl>
                                    <DateTimePicker value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Date when the transaction is planned to be executed. It will be used to relate
                                    unfulfilled transaction to a budget period.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="executed"
                        render={({ field }) => (
                            <FormItem className="col-span-6">
                                <FormLabel>Executed</FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        resettable
                                        value={field.value ?? undefined}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Date when transaction was executed. It will be used to relate the transaction to a
                                    budget period.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="col-span-6">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);

                                        if (!transaction) {
                                            setCookie(lastCategoryCookieName, value);
                                        }

                                        const category = categoriesIndex.get(value);

                                        if (category) {
                                            form.setValue('type', category.type);
                                        }
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                <div className="flex items-center">
                                                    <CategoryImage
                                                        category={category}
                                                        className="h-6 w-6 text-xs mr-2"
                                                    />
                                                    {category.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="hidden sm:block">
                                    Choose the category this transaction falls under.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-6">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Payee and/or description" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Payee and/or description of the transaction.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-3">
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
                                    Transaction type - debit (&quot;income&quot;) or credit (&quot;expense&quot;).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem className="col-span-4 sm:col-span-3">
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <CurrencyInput placeholder="0.00" {...field} />
                                </FormControl>
                                <FormDescription className="hidden sm:block">
                                    Transaction monetary amount.
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
