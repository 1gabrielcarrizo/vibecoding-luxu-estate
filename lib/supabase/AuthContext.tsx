"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "./client";
import { UserRole } from "@/types/database.types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  avatarUrl: string | null;
  displayName: string | null;
  email: string | null;
  provider: "google" | "github" | "email" | string | null;
  role: UserRole | null;
  isAdmin: boolean;
  refreshRole: () => Promise<void>;
  signInWithGoogle: (
    redirectToUrl?: string
  ) => Promise<{ data?: any; error: AuthError | null }>;
  signInWithGithub: (
    redirectToUrl?: string
  ) => Promise<{ data?: any; error: AuthError | null }>;
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
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserRole = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      return;
    }
    try {
      // 1. Check secure app_metadata (never user_metadata)
      if (currentUser.app_metadata?.role === "admin") {
        setRole("admin");
        return;
      }

      // 2. Query user_roles table
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (data?.role) {
        setRole(data.role as UserRole);
      } else {
        // Auto-register user in user_roles with default 'user' role
        try {
          const { data: inserted } = await supabase
            .from("user_roles")
            .upsert(
              {
                id: currentUser.id,
                email: currentUser.email || null,
                role: "user",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id", ignoreDuplicates: true }
            )
            .select("role")
            .maybeSingle();

          if (inserted?.role) {
            setRole(inserted.role as UserRole);
            return;
          }
        } catch {
          // Table may not yet be created in Supabase
        }
        setRole("user");
      }
    } catch {
      setRole("user");
    }
  }, []);

  const refreshRole = useCallback(async () => {
    await fetchUserRole(user);
  }, [user, fetchUserRole]);

  useEffect(() => {
    let mounted = true;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (!error && session) {
          setSession(session);
          setUser(session.user);
          fetchUserRole(session.user);
        } else {
          setRole(null);
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
        if (newSession?.user) {
          fetchUserRole(newSession.user);
        } else {
          setRole(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const signInWithGoogle = async (redirectToUrl?: string) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";
    const redirect = redirectToUrl || `${origin}/auth/callback`;
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signInWithGithub = async (redirectToUrl?: string) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";
    const redirect = redirectToUrl || `${origin}/auth/callback`;
    return await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirect,
      },
    });
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    return result;
  };

  const avatarUrl = useMemo(() => extractAvatarUrl(user), [user]);
  const displayName = useMemo(() => extractDisplayName(user), [user]);
  const provider = useMemo(() => extractProvider(user), [user]);
  const email = user?.email || null;
  const isAdmin = role === "admin" || user?.app_metadata?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      avatarUrl,
      displayName,
      email,
      provider,
      role,
      isAdmin,
      refreshRole,
      signInWithGoogle,
      signInWithGithub,
      signOut,
    }),
    [
      user,
      session,
      isLoading,
      avatarUrl,
      displayName,
      email,
      provider,
      role,
      isAdmin,
      refreshRole,
    ]
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

