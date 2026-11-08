import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type EmailOtpType } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ljywrsaedhniwekcapcw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeXdyc2FlZGhuaXdla2NhcGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjY3MTMsImV4cCI6MjEwNzg0MjcxM30.s7ZpVhB7biR9-guQX4z84XCq2yFeupZzrc0EIv8ZzlA";

/**
 * Server-side OAuth PKCE and Email OTP Callback Route Handler for Next.js App Router & @supabase/ssr.
 * Handles both code exchange (OAuth/PKCE) and token_hash (Email confirmations / Magic links).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/";

  // Prevent Open Redirect attacks by validating relative path
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore if setAll was called from Server Component / Route Handler
          }
        },
      },
    }
  );

  let authSuccess = false;

  // 1. Handle OAuth & PKCE flow via `code`
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      authSuccess = true;
    } else {
      console.error("Auth callback code exchange error:", error.message);
    }
  }
  // 2. Handle Email Confirmation / Magic Link / OTP via `token_hash` & `type`
  else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      authSuccess = true;
    } else {
      console.error("Auth callback verifyOtp error:", error.message);
    }
  }

  if (authSuccess) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${safeNext}`);
    } else {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Redirect to login with error parameter so the user can easily re-authenticate
  return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`);
}
