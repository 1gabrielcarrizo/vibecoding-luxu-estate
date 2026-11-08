import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ljywrsaedhniwekcapcw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeXdyc2FlZGhuaXdla2NhcGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjY3MTMsImV4cCI6MjEwNzg0MjcxM30.s7ZpVhB7biR9-guQX4z84XCq2yFeupZzrc0EIv8ZzlA";

// List of fallback admin emails configured via environment
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Updates session tokens on every request and enforces route protection.
 * Follows official @supabase/ssr Next.js App Router guidelines.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: DO NOT run custom code between createServerClient and getUser().
  // Using getUser() instead of getSession() validates the JWT on the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userEmail = (user.email || "").toLowerCase();

    // Verify admin role:
    // 1. Env configured admin emails
    // 2. app_metadata (secure, set only by server/service_role - NEVER user_metadata)
    const isEnvAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail);
    const isAppMetadataAdmin = user.app_metadata?.role === "admin";

    let hasAdminRole = isEnvAdmin || isAppMetadataAdmin;

    // 3. Database user_roles table check
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

    if (!hasAdminRole) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // If user is already logged in and navigates to /login without an error parameter, redirect to next or home
  if (pathname === "/login" && user && !request.nextUrl.searchParams.get("error")) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const safeNext =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : "/";
    const redirectUrl = new URL(safeNext, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

