import {
    Button,
    DatePicker,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { z } from 'zod';
import { Account, AccountType, Category, OperationType, Transaction } from '@prisma/client';
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransactionForm } from '@/hooks/use-transaction-form';
import { useCookies } from 'react-cookie';
import { fromDate } from '@internationalized/date';
import { CloseIcon } from '@nextui-org/shared-icons';
import { CurrencyInput } from '@/_old-ui/components/ui/currency-input';

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

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const form = useTransactionForm(transaction, {
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: {
            categoryId: transaction?.categoryId ?? lastCategory?.id,
            created: transaction?.created ?? new Date(),
            // executed: transaction?.executed ?? (account.type === AccountType.credit ? null : new Date()),
            executed: transaction?.executed ?? null,
            name: transaction?.name ?? '',
            type: transaction?.type ?? lastCategory?.type ?? OperationType.credit,
            value: transaction?.value ?? 0,
        },
    });

    const {
        formState: { errors },
    } = form;

    return (
        <div>
            <>
                <Button onPress={onOpen} color="primary">
                    Create
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                    <ModalContent>
                        {(onClose) => (
                            <FormProvider {...form}>
                                <form
                                    onSubmit={form.handleSubmit(async () => {
                                        onClose();
                                    })}
                                >
                                    <ModalHeader className="flex flex-col gap-1">Create Transaction</ModalHeader>
                                    <ModalBody>
                                        <Controller
                                            name="created"
                                            control={form.control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Created"
                                                    variant="bordered"
                                                    hideTimeZone
                                                    showMonthAndYearPickers
                                                    value={fromDate(
                                                        field.value,
                                                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                                                    )}
                                                    errorMessage={errors.created?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="executed"
                                            control={form.control}
                                            render={({ field }) => {
                                                console.log(field.value);
                                                return (
                                                    <DatePicker
                                                        label="Executed"
                                                        variant="bordered"
                                                        hideTimeZone
                                                        showMonthAndYearPickers
                                                        // placeholderValue={undefined}
                                                        value={
                                                            field.value
                                                                ? fromDate(
                                                                      field.value,
                                                                      Intl.DateTimeFormat().resolvedOptions().timeZone,
                                                                  )
                                                                : null
                                                        }
                                                        onChange={(value) => {
                                                            form.setValue('executed', value.toDate());
                                                        }}
                                                        startContent={
                                                            <button
                                                                className="p-0 m-0"
                                                                onClick={() => {
                                                                    form.setValue('executed', null);
                                                                }}
                                                            >
                                                                <CloseIcon className="w-5 h-5 text-gray-500" />
                                                            </button>
                                                        }
                                                        errorMessage={errors.executed?.message}
                                                    />
                                                );
                                            }}
                                        />
                                        <Controller
                                            name="categoryId"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select label="Category" {...field}>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id}>{category.name}</SelectItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />

                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field }) => <Input label="Name" variant="bordered" {...field} />}
                                        />

                                        <Controller
                                            name="type"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select label="Type" {...field}>
                                                    <SelectItem key={OperationType.debit} value={OperationType.debit}>
                                                        Debit
                                                    </SelectItem>
                                                    <SelectItem key={OperationType.debit} value={OperationType.credit}>
                                                        Credit
                                                    </SelectItem>
                                                </Select>
                                            )}
                                        />
                                        <Controller
                                            name="value"
                                            control={form.control}
                                            render={({ field }) => <CurrencyInput {...field} />}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onClick={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" type="submit" disabled={form.formState.isSubmitting}>
                                            Submit
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </FormProvider>
                        )}
                    </ModalContent>
                </Modal>
            </>
        </div>
    );
};
