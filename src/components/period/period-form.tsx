import * as React from 'react';
import { useState } from 'react';
import { Period } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DateTimePickerInput } from '@/components/date-time-picker-input';
import { ErrorText } from '@/components/error-text';

import '@mantine/dates/styles.css';

export type PeriodFormValues = Pick<Period, 'name' | 'started' | 'ended'>;

export interface PeriodFormProps extends React.HTMLAttributes<HTMLElement> {
  period?: PeriodFormValues;
  onFormSubmit: (data: PeriodFormValues) => Promise<void>;
}

export const PeriodForm = ({ period, onFormSubmit }: PeriodFormProps) => {
  const t = useTranslations();

  const [error, setError] = useState<unknown|undefined>(undefined);

  const schema = z.object({
    name: z
      .string()
      .min(2, {
        message: t('Validation.tooShort', { property: t('Period.name'), min: 2 }),
      })
      .max(80, {
        message: t('Validation.tooLong', { property: t('Period.name'), max: 80 }),
      }),
    started: z.date(),
    ended: z.date().nullish(),
  });

  const form = useForm<PeriodFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: period?.name ?? '',
      started: period?.started ?? new Date(),
      ended: period?.ended ?? null,
    },
    validate: zod4Resolver(schema),
  });

  const handleFormSubmit = form.onSubmit(async (data: PeriodFormValues) => {
    try {
      await onFormSubmit(data);
    } catch (error) {
      setError(error);
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <TextInput
        label={t('Period.name')}
        placeholder={t('PeriodForm.namePlaceholder')}
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <DateTimePickerInput
        label={t('Period.started')}
        placeholder={t('PeriodForm.startedPlaceholder')}
        mt="md"
        {...form.getInputProps('started')}
      />
      <DateTimePickerInput
        clearable
        label={t('Period.ended')}
        placeholder={t('PeriodForm.endedPlaceholder')}
        mt="md"
        {...form.getInputProps('ended')}
      />
      {error !== undefined && (
        <ErrorText error={error} p="xs" mt="xs" />
      )}
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={form.submitting}>{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
