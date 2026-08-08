import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PATHS = ["/dashboard", "/wallet", "/messages", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname === "/listings/new" ||
    (pathname.startsWith("/listings/") && pathname.endsWith("/edit"));

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users from protected pages
  if (isProtected && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Banned user check — block access to everything except /banned and /auth
  if (user && pathname !== "/banned") {
    const { data: seller } = await supabase
      .from("sellers")
      .select("banned")
      .eq("id", user.id)
      .single();

    if (seller?.banned) {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wallet/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/listings/new",
    "/listings/:id/edit",
    // Pages where banned check fires for logged-in users
    "/",
    "/listings",
    "/listings/:id",
    "/profile/:path*",
  ],
};
