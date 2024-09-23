'use client';

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { DialogTrigger } from '@/components/ui/dialog';
import { BudgetFormDialog } from '@/components/budget/budget-form-dialog';
import { Account, AccountType, Budget, Category, Period, TransactionType } from '@prisma/client';
import { CategoryImage } from '@/components/categories/category-image';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

interface BudgetTableProps {
    account: Account;
    categories: Category[];
    period: Period;
    periodBudgets: Map<string, Budget>;
    periodTransactionSums: Map<string, number>;
}

export const BudgetTable = ({
    account,
    categories,
    period,
    periodBudgets,
    periodTransactionSums,
}: BudgetTableProps) => {
    const { currency } = account;

    const getPlanned = (category: Category) => periodBudgets.get(category.id)?.value ?? 0;
    const getExpected = (category: Category) => periodTransactionSums.get(category.id) ?? 0;
    const getRest = (category: Category) => getPlanned(category) - getExpected(category);

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    const getTotalPlanned = () =>
        categories.reduce((acc, category) => {
            const sign = category.type === TransactionType.debit ? 1 : -1;
            acc += accountSign * sign * getPlanned(category);
            return acc;
        }, 0);

    const getTotalExpected = () =>
        categories.reduce((acc, category) => {
            const sign = category.type === TransactionType.debit ? 1 : -1;
            acc += accountSign * sign * getExpected(category);
            return acc;
        }, 0);

    const getTotalRest = () => getTotalPlanned() - getTotalExpected();

    const format = useCustomFormatter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[120px] text-right">Planned</TableHead>
                    <TableHead className="w-[100px] text-right">Expected</TableHead>
                    <TableHead className="w-[100px] text-right">Rest</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell className="flex items-center">
                            <CategoryImage category={category} className="h-6 w-6" />
                            <div className="ml-4 space-y-1">{category.name}</div>
                        </TableCell>
                        <TableCell className="text-right">
                            <BudgetFormDialog
                                periodId={period.id}
                                categoryId={category.id}
                                budget={periodBudgets.get(category.id)}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="h-8 min-w-24 p-2 text-right justify-end">
                                        {format.narrowCurrency(getPlanned(category), currency)}
                                    </Button>
                                </DialogTrigger>
                            </BudgetFormDialog>
                        </TableCell>
                        <TableCell className="text-right">{format.narrowCurrency(getExpected(category), currency)}</TableCell>
                        <TableCell className="text-right">{format.narrowCurrency(getRest(category), currency)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{format.narrowCurrency(getTotalPlanned(), currency)}</TableCell>
                    <TableCell className="text-right">{format.narrowCurrency(getTotalExpected(), currency)}</TableCell>
                    <TableCell className="text-right">{format.narrowCurrency(getTotalRest(), currency)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};
