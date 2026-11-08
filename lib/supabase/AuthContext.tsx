"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "./client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  avatarUrl: string | null;
  displayName: string | null;
  email: string | null;
  provider: "google" | "github" | "email" | string | null;
  signInWithGoogle: () => Promise<{ data?: any; error: AuthError | null }>;
  signInWithGithub: () => Promise<{ data?: any; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractAvatarUrl(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  if (meta.avatar_url) return meta.avatar_url;
  if (meta.picture) return meta.picture;

  if (user.identities && user.identities.length > 0) {
    for (const identity of user.identities) {
      const idData = identity.identity_data || {};
      if (idData.avatar_url) return idData.avatar_url;
      if (idData.picture) return idData.picture;
    }
  }
  return null;
}

function extractDisplayName(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return (
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    meta.preferred_username ||
    (user.email ? user.email.split("@")[0] : null) ||
    "User"
  );
}

function extractProvider(user: User | null): string | null {
  if (!user) return null;
  if (user.app_metadata && user.app_metadata.provider) {
    return user.app_metadata.provider;
  }
  if (user.identities && user.identities[0] && user.identities[0].provider) {
    return user.identities[0].provider;
  }
  const avatar = user.user_metadata?.avatar_url || "";
  if (avatar.includes("github")) return "github";
  if (avatar.includes("google")) return "google";
  return null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (!error && session) {
          setSession(session);
          setUser(session.user);
        }
        setIsLoading(false);
      }
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signInWithGithub = async () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";
    return await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    return result;
  };

  const avatarUrl = useMemo(() => extractAvatarUrl(user), [user]);
  const displayName = useMemo(() => extractDisplayName(user), [user]);
  const provider = useMemo(() => extractProvider(user), [user]);
  const email = user?.email || null;

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      avatarUrl,
      displayName,
      email,
      provider,
      signInWithGoogle,
      signInWithGithub,
      signOut,
    }),
    [user, session, isLoading, avatarUrl, displayName, email, provider]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

