//import {getServerSession} from "next-auth/next";
import NextAuth from "next-auth";
//import {authOptions} from "./app/api/auth/[...nextauth]/route";
import { auth } from "./auth"
import { NextResponse } from "next/server";
//import { authOptions } from "./app/api/auth/[...nextauth]/route";
//import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
      //source: '/(.*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

//export const { auth: middleware } = NextAuth(authOptions);

export default auth((req) => {
  // req.auth
  
  console.log('Authentication should happen', req.auth?.user)
  if(!req.auth?.user) {
    console.log('redirect');
    return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + '/api/auth/signin');
  }
})