import { useForm, UseFormProps } from 'react-hook-form';
import { login } from '@/actions/auth';

export const useLoginForm = (props?: UseFormProps<{ email: string; password: string }>) => {
    const form = useForm<{ email: string; password: string }>(props);

    const onCredentialsValid = (onValid: () => void) => async (data: { email: string; password: string }) => {
        await login(data.email, data.password);

        onValid();
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onCredentialsValid(onValid)),
    };
};
