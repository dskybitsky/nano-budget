'use client';

import { Account, Category, Period, Transaction } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteTransaction } from '@/actions/transaction';
import * as React from 'react';
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog';
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
import { cn } from '@/lib/utils';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

interface TransactionsTableProps {
    account: Account;
    categories: Category[];
    period: Period;
    periodTransactions: Transaction[];
    periodTotal: { expected: number; actual: number };
}

export const TransactionsTable = ({
    account,
    categories,
    period,
    periodTransactions,
    periodTotal,
}: TransactionsTableProps) => {
    const router = useRouter();

    const { currency } = account;

    const onDeleteHandler = async (id: string) => {
        await deleteTransaction(id);

        toast({
            description: 'Transaction deleted successfully.',
        });

        router.refresh();
    };

    const categoriesIndex = categories.reduce((acc, category) => {
        acc.set(category.id, category);
        return acc;
    }, new Map<string, Category>());

    const format = useCustomFormatter();

    return (
        <Table>
            <TableCaption>
                A list of transactions for period from {format.dateTimeShort(period.started)} until{' '}
                {format.dateTimeShort(period.ended, 'indefinite')}.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Created</TableHead>
                    <TableHead className="hidden sm:table-cell w-[200px]">Executed</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px] text-right">Value</TableHead>
                    <TableHead className="w-[50px] text-center"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {periodTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className={cn(transaction.executed ? '' : 'text-slate-400')}>
                        <TableCell>{format.dateTimeShort(transaction.created)}</TableCell>
                        <TableCell className="hidden sm:block">{format.dateTimeShort(transaction.executed)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {categoriesIndex.get(transaction.categoryId)?.name}
                        </TableCell>
                        <TableCell>{transaction.name}</TableCell>
                        <TableCell className="text-right">
                            {format.narrowCurrency(transaction.value, currency)}
                        </TableCell>
                        <TableCell className="text-center">
                            <TransactionFormDialog account={account} categories={categories} transaction={transaction}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <DotsHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
                                            Copy transaction ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DropdownMenuItem onClick={() => onDeleteHandler(transaction.id)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TransactionFormDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="hidden sm:table-cell" />
                    <TableCell className="hidden sm:table-cell" />
                    <TableCell className="hidden sm:table-cell" />
                    <TableCell className="text-right">
                        <p>{format.narrowCurrency(periodTotal.actual, currency)}</p>
                        {Math.abs(periodTotal.actual - periodTotal.expected) > 0.01 && (
                            <p className="text-slate-400">{format.narrowCurrency(periodTotal.expected, currency)}</p>
                        )}
                    </TableCell>
                    <TableCell />
                </TableRow>
            </TableFooter>
        </Table>
    );
};
