// import {NextRequest} from "next/server";
// import { jwtVerify } from 'jose';
//
// /**
//  * An array of routes that can be accessed without logging in
//  */
// const publicRoutes = [
//   "/terms",
//   "/privacy",
// ];
//
// /**
//  * An array of routes that are used for authentication.
//  * These routes will redirect logged-in users to main page.
//  */
// const authRoutes = [
//   "/",
//   "/login",
//   "/register",
//   "/error",
// ];
//
// /**
//  * The prefix for API authentication routes
//  * Routes that start with this prefix are used for API authentication.
//  */
// const apiAuthPrefix = "/api/auth";
//
// const JWT_AUTH_SECRET_KEY = new TextEncoder().encode(process.env.JWT_AUTH_SECRET!); // Use a secure secret!
//
// async function checkLoggedIn(req: NextRequest) {
//   const token = req.cookies.get(process.env.JWT_AUTH_COOKIE_NAME!);
//   if (!token) {
//     return false;
//   }
//   try {
//     const { payload } = await jwtVerify(token.value, JWT_AUTH_SECRET_KEY);
//     return !!payload
//   } catch {
//     return false; // Invalid token
//   }
// }
//
//
// export default async function middleware(req: NextRequest)

export default async function middleware() {
//   const { nextUrl } = req;
//   const isLoggedIn = await checkLoggedIn(req);
//
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//
//   if (isApiAuthRoute) {
//     return;
//   }
//
//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL("/dashboard", nextUrl))
//     }
//     return;
//   }
//
//   if (!isLoggedIn && !isPublicRoute) {
//     return Response.redirect(new URL("/login", nextUrl))
//   }
//
//   return;
// }
//
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ]
}
