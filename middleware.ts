import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const [APP_AUTH_USER, APP_AUTH_PASS] = (process.env.APP_AUTH || ':').split(':');

export function middleware(req: NextRequest) {
    if (APP_AUTH_USER && APP_AUTH_PASS && !isAuthenticated(req)) {
        return new NextResponse('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic' },
        });
    }

    return NextResponse.next();
}

function isAuthenticated(req: NextRequest) {
    const authheader = req.headers.get('authorization') || req.headers.get('Authorization');

    if (!authheader) {
        return false;
    }

    const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    return user == APP_AUTH_USER && pass == APP_AUTH_PASS;
}

export const config = {
    matcher: '/',
};
