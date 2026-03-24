/**
 * AuthContext: global auth state and actions.
 * - Subscribes to Supabase onAuthStateChange so UI stays in sync (refresh, new tab, logout elsewhere).
 * - Exposes user, loading, signUp, signIn, signOut for the rest of the app.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type UserRole = "admin" | "staff" | null;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  loadingRole: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        setSession(s);
        const currentUser = s?.user ?? null;
        setUser(currentUser);
        // Charge le rôle pour l'utilisateur courant
        if (currentUser) {
          setLoadingRole(true);
          const loadRole = async () => {
            try {
              const { data, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", currentUser.id)
                .maybeSingle();

              if (profileError || !data) {
                // Si le profil n'existe pas, on le crée

                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({
                    id: currentUser.id,
                    full_name: currentUser.email?.split("@")[0] || "User",
                    role: null,
                  })
                  .select("role")
                  .single();
                
                setRole(createError ? null : (newProfile?.role as UserRole));
              } else {
                setRole((data.role as UserRole) ?? null);
              }
            } catch (err) {
              console.error("Error loading role:", err);
              setRole(null);
            } finally {
              setLoadingRole(false);
            }
          };
          loadRole();
        } else {
          setRole(null);
          setLoadingRole(false);
        }
      })
      .catch(() => {
        setSession(null);
        setUser(null);
        setRole(null);
        setLoadingRole(false);
      })
      .finally(() => setLoading(false));

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        const currentUser = s?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          setLoadingRole(true);
          const loadRole = async () => {
            try {
              const { data, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", currentUser.id)
                .maybeSingle();

              if (profileError || !data) {
                // Auto-create profile if missing
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({
                    id: currentUser.id,
                    full_name: currentUser.email?.split("@")[0] || "User",
                    role: null,
                  })
                  .select("role")
                  .single();
                
                setRole(createError ? null : (newProfile?.role as UserRole));
              } else {
                setRole((data.role as UserRole) ?? null);
              }
            } catch (err) {
              console.error("Error loading role in auth change:", err);
              setRole(null);
            } finally {
              setLoadingRole(false);
            }
          };
          loadRole();
        } else {
          setRole(null);
          setLoadingRole(false);
        }
      });
      subscription = data.subscription;
    } catch {
      subscription = null;
    }

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ?? null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRole(null);
    setLoadingRole(false);
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    role,
    loadingRole,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
