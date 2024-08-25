import { useForm, UseFormProps } from 'react-hook-form';
import { Account } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { createAccount, updateAccount } from '@/actions/account';

export const useAccountForm = (account?: Account, props?: UseFormProps<Account>) => {
    const router = useRouter();
    const form = useForm<Account>(props);

    const onAccountValid = (onValid: () => void) => async (data: Account) => {
        if (account) {
            await updateAccount(account.id, data);
        } else {
            await createAccount(data);
            form.reset();
        }

        onValid();

        router.refresh();
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onAccountValid(onValid)),
    };
};
