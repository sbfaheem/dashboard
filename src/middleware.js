import { NextResponse } from "next/server";

export function middleware(req) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // The password defaults to "Admin123" if not set in Vercel as ADMIN_PASSWORD
    const validPassword = process.env.ADMIN_PASSWORD || "Admin123";

    if (user === "admin" && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Admin Area"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
