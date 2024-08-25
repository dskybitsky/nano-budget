import { createCategory, updateCategory } from '@/actions/category';
import { useForm, UseFormProps } from 'react-hook-form';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const useCategoryForm = (accountId: string, category?: Category, props?: UseFormProps<Category>) => {
    const router = useRouter();
    const form = useForm<Category>(props);

    const onCategoryValid = (onValid: () => void) => async (data: Category) => {
        if (category) {
            await updateCategory(category.id, data);
        } else {
            await createCategory({ ...data, accountId });
            form.reset();
        }

        onValid();

        router.refresh();
    };

    return {
        ...form,
        handleSubmit: (onValid: any) => form.handleSubmit(onCategoryValid(onValid)),
    };
};
