import { useForm, UseFormProps } from 'react-hook-form';
import { Budget } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { setBudget } from '@/actions/budget';

export const useBudgetForm = (categoryId: string, periodId: string, budget?: Budget, props?: UseFormProps<Budget>) => {
    const router = useRouter();
    const form = useForm<Budget>(props);

    const onBudgetValid = (onValid: () => void) => async (data: Budget) => {
        await setBudget({ ...data, categoryId, periodId });

        onValid();

        router.refresh();
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onBudgetValid(onValid)),
    };
};
