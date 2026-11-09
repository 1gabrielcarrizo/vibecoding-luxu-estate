"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Iniciando sesión...");

  useEffect(() => {
    let isMounted = true;

    async function processAuth() {
      try {
        const next = searchParams.get("next") || "/";
        const safeNext =
          next.startsWith("/") && !next.startsWith("//") ? next : "/";

        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error || errorDescription) {
          console.error("Auth callback error:", error, errorDescription);
          router.replace(
            `/login?error=${encodeURIComponent(
              errorDescription || error || "auth_error"
            )}`
          );
          return;
        }

        const code = searchParams.get("code");

        if (code) {
          setStatusText("Verificando credenciales...");
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn(
              "Exchange code error (session may already be active):",
              exchangeError.message
            );
          }
        }

        // Check if session is established
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (isMounted) {
            setStatusText("¡Autenticado con éxito! Redirigiendo...");
          }
          // Full navigation so all server components and middleware see updated cookies
          window.location.href = safeNext;
          return;
        }

        // Wait for auth state change if session is still settling (e.g. from hash fragment)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (newSession && isMounted) {
            subscription.unsubscribe();
            window.location.href = safeNext;
          }
        });

        // Safety fallback timer: if no session after 2 seconds, redirect to safeNext or login
        const timer = setTimeout(async () => {
          subscription.unsubscribe();
          const {
            data: { session: finalSession },
          } = await supabase.auth.getSession();
          if (finalSession) {
            window.location.href = safeNext;
          } else {
            window.location.href = safeNext;
          }
        }, 2000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        window.location.href = "/";
      }
    }

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 font-display">
      <div className="bg-surface dark:bg-[#152e2a] rounded-2xl shadow-soft p-8 max-w-sm w-full text-center border border-white/50 dark:border-primary/20 backdrop-blur-sm">
        <div className="w-12 h-12 border-3 border-mosque border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-nordic dark:text-white mb-1">
          {statusText}
        </h2>
        <p className="text-xs text-nordic/60 dark:text-gray-400">
          Por favor espera mientras completamos tu acceso.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mosque border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

