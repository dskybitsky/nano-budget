import * as React from 'react';

import { Button, Paper, PasswordInput, TextInput, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export type SignInFormValues = {
  email: string;
  password: string;
};

export interface SignInFormProps extends React.HTMLAttributes<HTMLElement> {
  onFormSubmit: (data: SignInFormValues) => Promise<string | undefined>;
}

export const SignInForm = ({ onFormSubmit }: SignInFormProps) => {
  const t = useTranslations();

  const schema = z.object({
    email: z.email(),
    password: z.string().min(1, {
      message: t('Validation.notEmpty', { property: t('SignIn.password') }),
    }),
  });

  const form = useForm<SignInFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: zod4Resolver(schema),
  });

  const [error, setError] = useState<string | undefined>(undefined);

  const handleFormSubmit = form.onSubmit(async (data: SignInFormValues) => {
    const error = await onFormSubmit(data);

    if (error) {
      setError(error);
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label={t('SignIn.email')}
          placeholder={t('SignInForm.emailPlaceholder')}
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label={t('SignIn.password')}
          placeholder={t('SignInForm.passwordPlaceholder')}
          key={form.key('password')}
          {...form.getInputProps('password')}
          mt="md"
        />
        { error && <Alert color="red" mt="md" icon={(<IconAlertCircle />)}>{error}</Alert> }
        <Button fullWidth mt="xl" type="submit">
          {t('Common.submit')}
        </Button>
      </Paper>
    </form>
  );
};
