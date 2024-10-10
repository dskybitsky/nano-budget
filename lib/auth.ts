import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

async function getUser(email: string, password: string): Promise<any> {
    return {
        id: 1,
        name: 'test user',
        email: email,
        password: password,
    };
}

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        error: '/',
        signIn: '/',
        signOut: '/',
    },
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
    },
    providers: [],
} satisfies NextAuthConfig;

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await getUser(credentials.email as string, credentials.password as string);

                return user ?? null;
            },
        }),
    ],
});
