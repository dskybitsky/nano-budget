import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import React from 'react';
import { TransactionsIndexSuccessDto } from '@/actions/use-cases/index-transactions';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { DeleteIcon } from '@/components/icons/table/delete-icon';

interface TransactionsTableProps {
    dto: TransactionsIndexSuccessDto;
}

export const TransactionsTable = ({ dto }: TransactionsTableProps) => {
    const format = useCustomFormatter();

    return (
        <div className=" w-full flex flex-col gap-4">
            <Table aria-label="Example table with custom cells">
                <TableHeader>
                    <TableColumn key="created">Created</TableColumn>
                    <TableColumn key="executed">Executed</TableColumn>
                    <TableColumn key="category">Category</TableColumn>
                    <TableColumn key="name">Name</TableColumn>
                    <TableColumn key="value">Value</TableColumn>
                    <TableColumn key="acions" hideHeader>
                        Actions
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {dto.periodTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{format.dateTimeShort(transaction.created)}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {format.dateTimeShort(transaction.executed)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{transaction.category.name}</TableCell>
                            <TableCell>{transaction.name}</TableCell>
                            <TableCell className="text-right">
                                {format.narrowCurrency(transaction.value, 'CAD')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4 ">
                                    <div>
                                        <Tooltip content="Details">
                                            <button onClick={() => console.log('View user')}>
                                                <EyeIcon size={20} fill="#979797" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip content="Edit user" color="secondary">
                                            <button onClick={() => console.log('Edit user')}>
                                                <EditIcon size={20} fill="#979797" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip
                                            content="Delete user"
                                            color="danger"
                                            onClick={() => console.log('Delete user')}
                                        >
                                            <button>
                                                <DeleteIcon size={20} fill="#FF0080" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
