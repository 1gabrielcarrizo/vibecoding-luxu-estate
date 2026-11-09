"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/supabase/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/common/LanguageSelector";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(
    null
  );

  const nextUrl = searchParams.get("next") || "/";
  const errorParam = searchParams.get("error");

  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "auth_exchange_failed"
      ? "La sesión anterior expiró o requiere renovación. Haz clic en el proveedor a continuación para iniciar sesión."
      : errorParam
  );

  useEffect(() => {
    if (user) {
      router.replace(nextUrl);
    }
  }, [user, router, nextUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      setLoadingProvider("google");
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectTarget =
        nextUrl && nextUrl !== "/"
          ? `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`
          : `${origin}/auth/callback`;

      const { error } = await signInWithGoogle(redirectTarget);
      if (error) {
        setErrorMessage(error.message);
        setLoadingProvider(null);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initiate Google sign in.");
      setLoadingProvider(null);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setErrorMessage(null);
      setLoadingProvider("github");
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectTarget =
        nextUrl && nextUrl !== "/"
          ? `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`
          : `${origin}/auth/callback`;

      const { error } = await signInWithGithub(redirectTarget);
      if (error) {
        setErrorMessage(error.message);
        setLoadingProvider(null);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initiate GitHub sign in.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 antialiased text-nordic dark:text-gray-100 relative overflow-hidden">
      {/* Top Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <LanguageSelector />
      </div>

      {/* Background Decorative Blur Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl dark:bg-primary/10"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-6 shadow-soft text-white transition-transform hover:scale-105 cursor-pointer"
            aria-label={t("auth.returnHome") || "Return to LuxeEstate home"}
          >
            <span className="material-symbols-rounded text-3xl">real_estate_agent</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white mb-2">
            {t("auth.welcome")}
          </h1>
          <p className="text-nordic/60 dark:text-gray-400">
            {t("auth.subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface dark:bg-[#152e2a] rounded-2xl shadow-soft p-8 sm:p-10 border border-white/50 dark:border-primary/20 backdrop-blur-sm">
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-xs leading-relaxed">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingProvider !== null}
              className="group w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1a3833] border border-gray-100 dark:border-primary/30 rounded-lg p-3.5 text-nordic dark:text-white font-medium transition-all duration-300 hover:shadow-soft-hover hover:-translate-y-0.5 relative overflow-hidden cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              {loadingProvider === "google" ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <svg
                  className="w-5 h-5 relative z-10"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="relative z-10 text-sm">
                {loadingProvider === "google"
                  ? t("auth.connectingGoogle")
                  : t("auth.continueWithGoogle")}
              </span>
            </button>

            {/* GitHub Login Button */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loadingProvider !== null}
              className="group w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1a3833] border border-gray-100 dark:border-primary/30 rounded-lg p-3.5 text-nordic dark:text-white font-medium transition-all duration-300 hover:shadow-soft-hover hover:-translate-y-0.5 relative overflow-hidden cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              {loadingProvider === "github" ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <svg
                  className="w-5 h-5 fill-current text-nordic dark:text-white relative z-10"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  />
                </svg>
              )}
              <span className="relative z-10 text-sm">
                {loadingProvider === "github"
                  ? t("auth.connectingGithub")
                  : t("auth.continueWithGithub")}
              </span>
            </button>
          </div>

          {/* Terms info */}
          <div className="mt-8 text-center text-xs text-nordic/40 dark:text-gray-500 leading-relaxed">
            {t("auth.termsAgreement")}{" "}
            <Link
              className="text-primary dark:text-accent hover:underline font-medium"
              href="#"
            >
              {t("auth.termsOfService")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link
              className="text-primary dark:text-accent hover:underline font-medium"
              href="#"
            >
              {t("auth.privacyPolicy")}
            </Link>
            .
          </div>
        </div>

        {/* Alternative Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-nordic/60 dark:text-gray-400">
            {t("auth.noAccount")}{" "}
            <button
              onClick={() => handleGoogleSignIn()}
              className="text-primary dark:text-accent font-semibold hover:underline cursor-pointer"
            >
              {t("auth.signUp")}
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <nav className="flex justify-center gap-6 text-xs text-nordic/50 dark:text-gray-500">
            <Link
              className="hover:text-nordic dark:hover:text-gray-300 transition-colors"
              href="#"
            >
              {t("auth.privacyPolicy")}
            </Link>
            <Link
              className="hover:text-nordic dark:hover:text-gray-300 transition-colors"
              href="#"
            >
              {t("auth.termsOfService")}
            </Link>
            <Link
              className="hover:text-nordic dark:hover:text-gray-300 transition-colors"
              href="#"
            >
              {t("auth.helpCenter")}
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mosque border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
