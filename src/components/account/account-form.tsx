import * as React from 'react';

import { Account, AccountType } from '@prisma/client';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Button, Group, NumberInput, Select, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';

export type AccountFormValues = Pick<Account, 'name' | 'type' | 'currency' | 'value' | 'icon' | 'order'>;

export interface AccountFormProps extends React.HTMLAttributes<HTMLElement> {
  account?: Account;
  onFormSubmit: (data: AccountFormValues) => Promise<void>;
}

export const AccountForm = ({ account, onFormSubmit }: AccountFormProps) => {
  const t = useTranslations();

  const schema = z.object({
    name: z
      .string()
      .min(2, {
        message: t('Validation.tooShort', { property: t('Account.name'), min: 2 }),
      })
      .max(80, {
        message: t('Validation.tooLong', { property: t('Account.name'), max: 80 }),
      }),
    type: z.enum([AccountType.checking, AccountType.savings, AccountType.credit, AccountType.virtual]),
    currency: z.string().max(5, {
      message: t('Validation.tooLong', { property: t('Account.currency'), max: 5 }),
    }),
    value: z.coerce.number(),
    icon: z.string(),
    order: z.coerce.number(),
  });

  const form = useForm<AccountFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: account?.name ?? '',
      type: account?.type ?? AccountType.checking,
      currency: account?.currency ?? 'USD',
      value: account?.value ?? 0,
      icon: account?.icon ?? '',
      order: account?.order ?? 0,
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)} className="space-y-8">
      <TextInput
        label={t('Account.name')}
        placeholder={t('AccountForm.namePlaceholder')}
        key={form.key('name')}
        mt="md"
        {...form.getInputProps('name')}
      />
      <Select
        label={t('Account.type')}
        placeholder={t('AccountForm.typePlaceholder')}
        key={form.key('type')}
        mt="md"
        data={[
          { value: AccountType.checking, label: t('Enum.AccountType', { value: AccountType.checking}) },
          { value: AccountType.savings, label: t('Enum.AccountType', { value: AccountType.savings}) },
          { value: AccountType.credit, label: t('Enum.AccountType', { value: AccountType.credit}) },
          { value: AccountType.virtual, label: t('Enum.AccountType', { value: AccountType.virtual}) },
        ]}
        {...form.getInputProps('type')}
      />
      <TextInput
        label={t('Account.currency')}
        placeholder={t('AccountForm.currencyPlaceholder')}
        key={form.key('currency')}
        mt="md"
        {...form.getInputProps('currency')}
      />
      <NumberInput
        label={t('Account.value')}
        placeholder={t('AccountForm.valuePlaceholder')}
        key={form.key('value')}
        mt="md"
        {...form.getInputProps('value')}
      />
      <TextInput
        label={t('Account.icon')}
        placeholder={t('AccountForm.iconPlaceholder')}
        key={form.key('icon')}
        mt="md"
        {...form.getInputProps('icon')}
      />
      <NumberInput
        label={t('Account.order')}
        placeholder={t('AccountForm.orderPlaceholder')}
        key={form.key('order')}
        mt="md"
        {...form.getInputProps('order')}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">{t('Common.submit')}</Button>
      </Group>
    </form>
  );
};
