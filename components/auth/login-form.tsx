'use client';

import { Button, Input } from '@nextui-org/react';
import { useLoginForm } from '@/hooks/use-login-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, FormProvider } from 'react-hook-form';

const LoginFormSchema = z.object({
    email: z.string().trim().min(1, { message: 'Email required!' }).email({ message: 'Invalid email!' }),
    password: z
        .string()
        .trim()
        .min(1, { message: 'Password required!' })
        .min(8, { message: 'Password must have at least 8 characters!' }),
});

export const LoginForm = () => {
    const form = useLoginForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        formState: { errors },
    } = form;

    console.log(errors);

    return (
        <>
            <div className="text-center text-[25px] font-bold mb-6">Login</div>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(async () => { console.log('submit')})} className="w-1/2">
                    <div className="flex flex-col w-full gap-4 mb-4">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    variant="bordered"
                                    label="Email"
                                    type="email"
                                    {...field}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    variant="bordered"
                                    label="Password"
                                    type="password"
                                    {...field}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" disabled={form.formState.isSubmitting} variant="flat" color="primary">
                            Login
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};
