'use server';

import { signIn, signOut } from '@/lib/auth';

export async function login(email: string, password: string) {
    await signIn('credentials', { email, password, redirectTo: '/', redirect: true });
}

export async function logout() {
    await signOut({ redirectTo: '/login', redirect: true });
}
