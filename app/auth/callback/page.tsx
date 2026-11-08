"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const processAuth = async () => {
      try {
        const code = searchParams.get("code");
        const next = searchParams.get("next") || "/";

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Exchange code error:", error.message);
            if (active) setErrorMessage(error.message);
            return;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (active) router.replace(next);
        } else {
          // Listen once for state change (hash-based fallback)
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, s) => {
            if (s || event === "SIGNED_IN") {
              subscription.unsubscribe();
              if (active) router.replace(next);
            }
          });

          // Timeout fallback to redirect
          setTimeout(() => {
            if (active) router.replace(next);
          }, 3000);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (active) {
          setErrorMessage(err?.message || "Authentication failed. Please try again.");
        }
      }
    };

    processAuth();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 text-nordic dark:text-gray-100">
      <div className="w-full max-w-sm bg-surface dark:bg-[#152e2a] rounded-2xl shadow-soft p-8 text-center border border-white/50 dark:border-primary/20 backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-4 shadow-soft text-white animate-pulse">
          <span className="material-symbols-rounded text-3xl">real_estate_agent</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-nordic dark:text-white mb-2">
          {errorMessage ? t("auth.authIssue") : t("auth.signingIn")}
        </h2>
        {errorMessage ? (
          <div className="mt-4">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.replace("/login")}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              {t("auth.returnToLogin")}
            </button>
          </div>
        ) : (
          <p className="text-xs text-nordic/60 dark:text-gray-400">
            {t("auth.waitSession")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
          <div className="text-nordic/60 text-sm font-medium animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
