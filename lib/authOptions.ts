import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';

const providers = [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            const [username, password] = (process.env.AUTH_USER || ':').split(':');

            if (credentials && credentials.username === username && credentials.password === password) {
                return { id: '1', name: username };
            }

            return null;
        },
    }),
];

export const authOptions: AuthOptions = {
    providers,
    secret: process.env.AUTH_SECRET,
};
