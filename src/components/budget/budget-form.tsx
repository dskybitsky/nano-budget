import * as React from 'react';
import { useState } from 'react';
import { Budget } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { ErrorText } from '@/components/error-text';
import { CurrencyInput } from '@/components/currency-input';

export type BudgetFormValues = Pick<Budget, 'value'>;

export interface BudgetFormProps extends React.HTMLAttributes<HTMLElement> {
  budget?: BudgetFormValues;
  onFormSubmit: (data: BudgetFormValues) => Promise<void>;
}

export const BudgetForm = ({ budget, onFormSubmit }: BudgetFormProps) => {
  const t = useTranslations();

  const [error, setError] = useState<unknown|undefined>(undefined);

  const schema = z.object({
    value: z.coerce.number().gt(0, {
      message: t('Validation.negative', { property: t('Transaction.value') }),
    }),
  });

  const form = useForm<BudgetFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      value: budget?.value ?? 0,
    },
    validate: zod4Resolver(schema),
  });

  const handleFormSubmit = form.onSubmit(async (data: BudgetFormValues) => {
    try {
      await onFormSubmit(data);
    } catch (error) {
      setError(error);
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <CurrencyInput
        label={t('Budget.value')}
        placeholder={t('BudgetForm.valuePlaceholder')}
        key={form.key('value')}
        {...form.getInputProps('value')}
      />
      {error !== undefined && (
        <ErrorText error={error} p="xs" mt="xs" />
      )}
      <Group justify="flex-end" mt="md">
        <Button type="submit">{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
