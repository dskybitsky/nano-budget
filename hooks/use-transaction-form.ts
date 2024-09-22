import { createTransaction, updateTransaction } from '@/actions/transaction';
import { useForm, UseFormProps } from 'react-hook-form';
import { Transaction } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const useTransactionForm = (transaction?: Transaction, props?: UseFormProps<Transaction>) => {
    const router = useRouter();
    const form = useForm<Transaction>(props);

    const onTransactionValid = (onValid: () => void) => async (data: Transaction) => {
        if (transaction) {
            await updateTransaction(transaction.id, data);
        } else {
            await createTransaction(data);
            form.reset();
        }

        onValid();

        router.refresh();
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onTransactionValid(onValid)),
    };
};
