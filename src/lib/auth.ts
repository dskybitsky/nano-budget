import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (
          email === process.env.ADMIN_EMAIL
          && password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: `${email}`,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
});

export const getSessionUser = async (): Promise<User> => {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
};
