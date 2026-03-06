import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_KEY = "rosey-auth";

function parseAuthCookie(request: NextRequest) {
  const raw = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const auth = parseAuthCookie(request);
    const role = auth?.user?.user_metadata?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
