'use client';

import { signIn } from 'next-auth/react';
import { SignInForm, SignInFormValues } from '@/components/auth/sign-in-form';
import { Center, Container, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const SignInView = () => {
  const t = useTranslations();

  const handleFormSubmit = async (formValues: SignInFormValues) => {
    const { ok, code, error, url } = await signIn('credentials', {
      email: formValues.email,
      password: formValues.password,
      redirect: false,
      redirectTo: '/',
    });

    if (code === 'credentials') {
      return t('SignInView.credentialsError');
    }

    if (!ok) {
      return t('Common.error', { error: error ?? 'Unknown error' });
    }

    redirect(url ?? '/');
  };

  return (
    <Container size={420} my={40}>
      <Center>
        <Title>{t('SignInView.title')}</Title>
      </Center>
      <SignInForm onFormSubmit={handleFormSubmit} />
    </Container>
  );
};
