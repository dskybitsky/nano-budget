import { auth } from '@/lib/auth';

export default auth((req) => {
  if (
    !req.auth
    && req.nextUrl.pathname !== '/sign-in'
  ) {
    const newUrl = new URL('/sign-in', req.nextUrl.origin);

    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|favicon.ico|.*\\..*).*)',
};
