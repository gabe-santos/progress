import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "./app/lib/pocketbase";

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("pb_auth");

  // Check if we're on the login page
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (cookie) {
      // If we have a cookie and we're on the login page, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
    // If no cookie and on login page, allow the request
    return NextResponse.next();
  }

  // For all other pages, check for authentication
  if (!cookie) {
    // If no cookie, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Create PocketBase client
    const pb = createServerClient();

    // Load the auth store from the cookie
    pb.authStore.loadFromCookie(`pb_auth=${cookie.value}`);

    // Validate the token
    if (pb.authStore.isValid) {
      // If valid, allow the request
      return NextResponse.next();
    } else {
      // If invalid, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("pb_auth");
      return response;
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    // If there's an error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
