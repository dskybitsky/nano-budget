import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES } from '@/lib/routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (isPublicRoute || isAuthenticated) return NextResponse.next();

    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
