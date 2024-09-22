'use client';

import { Account, AccountType, Category, Period, Transaction, TransactionType } from '@prisma/client';
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
import { cn, formatCurrency } from '@/lib/utils';
import { TransactionTypeLabel } from '@/components/transactions/transaction-type-label';
import { useFormatter } from 'next-intl';

interface TransactionsTableProps {
    account: Account;
    categories: Category[];
    period: Period;
    periodTransactions: Transaction[];
}

export const TransactionsTable = ({ account, categories, period, periodTransactions }: TransactionsTableProps) => {
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

    let totalActual = 0;
    let totalExpected = 0;

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    periodTransactions.forEach((transaction) => {
        const sign = transaction.type == TransactionType.credit ? -1 : 1;

        if (transaction.executed) {
            totalActual += accountSign * sign * transaction.value;
        }

        totalExpected += accountSign * sign * transaction.value;
    });

    const format = useFormatter();

    const periodStarted = format.dateTime(period.started, 'short');
    const periodEnded = period.ended ? format.dateTime(period.ended, 'short') : 'indefinite';

    return (
        <Table>
            <TableCaption>
                A list of transactions for period from {periodStarted} until {periodEnded}.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Created</TableHead>
                    <TableHead className="w-[200px]">Executed</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px] text-right">Value</TableHead>
                    <TableHead className="w-[50px] text-center"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {periodTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className={cn(transaction.executed ? '' : 'text-slate-400')}>
                        <TableCell>{format.dateTime(transaction.created, 'short')}</TableCell>
                        <TableCell>
                            {transaction.executed ? format.dateTime(transaction.executed, 'short') : ''}
                        </TableCell>
                        <TableCell>{categoriesIndex.get(transaction.categoryId)?.name}</TableCell>
                        <TableCell>
                            <TransactionTypeLabel type={transaction.type} />
                        </TableCell>
                        <TableCell>{transaction.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.value, currency)}</TableCell>
                        <TableCell className="text-center">
                            <TransactionFormDialog categories={categories} transaction={transaction}>
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
                    <TableCell colSpan={5}>Total</TableCell>
                    <TableCell className="text-right">
                        <p>{formatCurrency(totalActual, currency)}</p>
                        {totalActual != totalExpected && (
                            <p className="text-slate-400">{formatCurrency(totalExpected, currency)}</p>
                        )}
                    </TableCell>
                    <TableCell />
                </TableRow>
            </TableFooter>
        </Table>
    );
};
