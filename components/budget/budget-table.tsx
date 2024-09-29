'use client';

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { DialogTrigger } from '@/components/ui/dialog';
import { BudgetFormDialog } from '@/components/budget/budget-form-dialog';
import { Account, Budget, Category, Period } from '@prisma/client';
import { CategoryImage } from '@/components/categories/category-image';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { currencyEq } from '@/lib/utils';

interface BudgetTableProps {
    account: Account;
    categories: Category[];
    period: Period;
    periodBudgets: Map<string, Budget>;
    periodTransactionSums: Map<string, { expected: number; actual: number }>;
    periodTotal: { planned: number; expected: number; actual: number };
}

export const BudgetTable = ({
    account,
    categories,
    period,
    periodBudgets,
    periodTransactionSums,
    periodTotal,
}: BudgetTableProps) => {
    const { currency } = account;

    const format = useCustomFormatter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[120px] text-right">Planned</TableHead>
                    <TableHead className="w-[100px] text-right hidden sm:table-cell">Expected</TableHead>
                    <TableHead className="w-[100px] text-right hidden sm:table-cell">Actual</TableHead>
                    <TableHead className="w-[100px] text-right">Rest</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => {
                    const planned = periodBudgets.get(category.id)?.value ?? 0;
                    const expected = periodTransactionSums.get(category.id)?.expected ?? 0;
                    const actual = periodTransactionSums.get(category.id)?.actual ?? 0;
                    const restExpected = planned - expected;
                    const restActual = planned - actual;

                    let bgClassName = '';

                    if (restActual < 0) {
                        bgClassName = 'bg-red-100';
                    } else if (restActual > 0) {
                        bgClassName = 'bg-green-100';
                    }

                    return (
                        <TableRow key={category.id} className={bgClassName}>
                            <TableCell>
                                <div className="flex items-center">
                                    <CategoryImage category={category} className="h-8 w-8 text-xs mr-6" />
                                    {category.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <BudgetFormDialog
                                    periodId={period.id}
                                    categoryId={category.id}
                                    budget={periodBudgets.get(category.id)}
                                >
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="h-8 min-w-24 p-2 text-right justify-end">
                                            {format.narrowCurrency(planned, currency)}
                                        </Button>
                                    </DialogTrigger>
                                </BudgetFormDialog>
                            </TableCell>
                            {currencyEq(expected, actual) && (
                                <TableCell className="text-center hidden sm:table-cell" colSpan={2}>
                                    {format.narrowCurrency(expected, currency)}
                                </TableCell>
                            )}
                            {!currencyEq(expected, actual) && (
                                <>
                                    <TableCell className="text-right hidden sm:table-cell">
                                        {format.narrowCurrency(expected, currency)}
                                    </TableCell>
                                    <TableCell className="text-right hidden sm:table-cell">
                                        {format.narrowCurrency(actual, currency)}
                                    </TableCell>
                                </>
                            )}
                            <TableCell className="text-right font-semibold">
                                {format.narrowCurrency(restExpected, currency)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{format.narrowCurrency(periodTotal.planned, currency)}</TableCell>
                    {currencyEq(periodTotal.expected, periodTotal.actual) && (
                        <TableCell className="text-center hidden sm:table-cell" colSpan={2}>
                            {format.narrowCurrency(periodTotal.expected, currency)}
                        </TableCell>
                    )}
                    {!currencyEq(periodTotal.expected, periodTotal.actual) && (
                        <>
                            <TableCell className="text-right hidden sm:table-cell">
                                {format.narrowCurrency(periodTotal.expected, currency)}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                                {format.narrowCurrency(periodTotal.actual, currency)}
                            </TableCell>
                        </>
                    )}
                    <TableCell className="text-right">
                        {format.narrowCurrency(periodTotal.planned - periodTotal.expected, currency)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};
