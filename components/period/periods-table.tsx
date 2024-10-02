'use client';

import { Period } from '@prisma/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import * as React from 'react';
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
import { deletePeriod } from '@/actions/period';
import { PeriodFormDialog } from '@/components/period/period-form-dialog';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

interface PeriodsTableProps {
    accountId: string;
    periods: Period[];
}

export const PeriodsTable = ({ accountId, periods }: PeriodsTableProps) => {
    const router = useRouter();

    const onDeleteHandler = async (id: string) => {
        await deletePeriod(id);

        toast({
            description: 'Period deleted successfully.',
        });

        router.refresh();
    };

    const format = useCustomFormatter();

    return (
        <Table>
            <TableCaption>A list of account periods.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[200px]">Started</TableHead>
                    <TableHead className="w-[200px]">Ended</TableHead>
                    <TableHead className="w-[50px] text-center"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {periods.map((period) => (
                    <TableRow key={period.id}>
                        <TableCell>{period.name}</TableCell>
                        <TableCell>{format.dateTimeShort(period.started)}</TableCell>
                        <TableCell>{format.dateTimeShort(period.ended)}</TableCell>
                        <TableCell>
                            <PeriodFormDialog accountId={accountId} period={period}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <DotsHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DropdownMenuItem onClick={() => onDeleteHandler(period.id)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </PeriodFormDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
