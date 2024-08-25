import { createPeriod, updatePeriod } from '@/actions/period';
import { useForm, UseFormProps } from 'react-hook-form';
import { Period } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const usePeriodForm = (accountId: string, period?: Period, props?: UseFormProps<Period>) => {
    const router = useRouter();
    const form = useForm<Period & { entity?: never }>(props);

    const onPeriodValid = (onValid: () => void) => async (data: Period) => {
        try {
            if (period) {
                await updatePeriod(period.id, { ...period, ...data });
            } else {
                await createPeriod({ ...data, accountId });
            }

            form.reset();

            onValid();

            router.refresh();
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            form.setError('entity', { type: 'submit', message });
        }
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onPeriodValid(onValid)),
    };
};
