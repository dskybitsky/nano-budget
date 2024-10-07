import * as React from 'react';

import { Budget } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, NumberInput } from '@mantine/core';
import { useTranslations } from 'next-intl';

export type BudgetFormValues = Pick<Budget, 'value'>;

export interface BudgetFormProps extends React.HTMLAttributes<HTMLElement> {
  budget?: Budget;
  onFormSubmit: (data: BudgetFormValues) => Promise<void>;
}

export const BudgetForm = ({ budget, onFormSubmit }: BudgetFormProps) => {
  const t = useTranslations();

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

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)} className="space-y-8">
      <NumberInput
        label={t('Budget.value')}
        placeholder={t('BudgetForm.valuePlaceholder')}
        key={form.key('value')}
        mt="md"
        {...form.getInputProps('value')}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
