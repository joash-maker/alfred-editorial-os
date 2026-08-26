import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "alfred_session";

async function createSessionToken(password: string) {
  const data = new TextEncoder().encode(
    `alfred-private:${password}`
  );

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(
  request: NextRequest
) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/api/auth/login",
    "/api/auth/logout",
  ];

  if (
    publicRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  const password = process.env.ALFRED_PASSWORD;

  if (!password) {
    return new NextResponse(
      "Alfred private access has not been configured.",
      {
        status: 503,
      }
    );
  }

  const expectedToken =
    await createSessionToken(password);

  const currentToken =
    request.cookies.get(COOKIE_NAME)?.value;

  if (currentToken === expectedToken) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Unauthorised",
      },
      {
        status: 401,
      }
    );
  }

  const loginUrl = new URL(
    "/login",
    request.url
  );

  loginUrl.searchParams.set(
    "next",
    `${pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
