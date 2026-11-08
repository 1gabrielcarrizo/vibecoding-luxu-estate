import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ljywrsaedhniwekcapcw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeXdyc2FlZGhuaXdla2NhcGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjY3MTMsImV4cCI6MjEwNzg0MjcxM30.s7ZpVhB7biR9-guQX4z84XCq2yFeupZzrc0EIv8ZzlA";

// List of fallback admin emails (comma-separated in env or defaults)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    // 1. Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userEmail = (user.email || "").toLowerCase();

    // 2. Check if user is an env-configured admin or has metadata role
    const isEnvAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail);
    const isMetadataAdmin =
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin";

    let hasAdminRole = isEnvAdmin || isMetadataAdmin;

    // 3. Check role from user_roles database table
    if (!hasAdminRole) {
      try {
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (roleRow && roleRow.role === "admin") {
          hasAdminRole = true;
        }
      } catch (dbError) {
        console.warn("Middleware user_roles lookup error:", dbError);
      }
    }

    // 4. If not admin, redirect to unauthorized error page
    if (!hasAdminRole) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match admin routes only:
     * - /admin
     * - /admin/...
     */
    "/admin",
    "/admin/:path*",
  ],
};

