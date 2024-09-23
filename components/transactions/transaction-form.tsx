'use client';

import * as React from 'react';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Account, AccountType, Category, Transaction, TransactionType } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionForm } from '@/hooks/use-transaction-form';
import { useEffect } from 'react';
import { DateTimePicker } from '@/components/ui/datetime-picker';

const TransactionFormSchema = z.object({
    categoryId: z.string(),
    created: z.date(),
    executed: z.date().nullish(),
    type: z.enum([TransactionType.debit, TransactionType.credit]),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(80, { message: 'Name can be maximum 80 characters.' }),
    value: z.coerce.number().gt(0, 'Must be greater than zero'),
});

interface TransactionFormProps {
    account: Account;
    categories: Category[];
    transaction?: Transaction;
    formElementId?: string;
    onValid?: () => void;
}

export const TransactionForm = ({ account, categories, transaction, formElementId, onValid }: TransactionFormProps) => {
    const form = useTransactionForm(transaction, {
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: {
            categoryId: transaction?.categoryId,
            created: transaction?.created ?? moment().startOf('day').toDate(),
            executed: transaction?.executed ?? (
                account.type === AccountType.credit ? null : moment().startOf('day').toDate()
            ),
            type: transaction?.type ?? TransactionType.credit,
            name: transaction?.name ?? '',
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

    const getCategoryType = (categoryId: string) => categories.find((c) => c.id === categoryId)?.type;

    return (
        <Form {...form}>
            <form id={formElementId} onSubmit={form.handleSubmit(onFormValid)}>
                <div className="grid gap-4 grid-cols-6 space-y-4 py-2 pb-4">
                    <FormField
                        control={form.control}
                        name="created"
                        render={({ field }) => (
                            <FormItem className="col-span-6">
                                <FormLabel>Created</FormLabel>
                                <FormControl>
                                    <DateTimePicker value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>
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
                                <FormDescription>
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
                            <FormItem className="col-span-3">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);

                                        if (!transaction) {
                                            const categoryType = getCategoryType(value);

                                            if (categoryType) {
                                                form.setValue('type', categoryType);
                                            }
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
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Choose the category this transaction falls under.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transaction type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem key={TransactionType.debit} value={TransactionType.debit}>
                                            Debit
                                        </SelectItem>
                                        <SelectItem key={TransactionType.credit} value={TransactionType.credit}>
                                            Credit
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
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
                            <FormItem className="col-span-4">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="New transaction" {...field} />
                                </FormControl>
                                <FormDescription>Payee and/or description of the transaction.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" placeholder="Amount" {...field} />
                                </FormControl>
                                <FormDescription>Transaction monetary amount.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};
