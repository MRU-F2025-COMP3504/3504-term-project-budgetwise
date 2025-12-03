import { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/helpers/supabaseBrowserClient";

const supabase = createSupabaseBrowserClient();
import api from "@/services/api";

// 1. Create Context
// This is like a global variable that holds the user's login state.
const AuthContext = createContext({});

// 2. Custom Hook
// This makes it easy for any component to say `const { user } = useAuth();`
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider Component
// This wraps our entire app and manages the actual login logic.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. Check Session on Load
  // When the app starts, we ask Supabase "Is there a user logged in?"
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // 5. Listen for Changes
  // If the user logs out in another tab or their session expires, Supabase tells us here.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        api.cache.clear(); // Clear old data so the next user doesn't see it
      }
      if (event === "SIGNED_IN") {
        api.cache.clear(); // Start fresh
      }
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Register function
  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    api.cache.clear();
    setUser(null);
    return { error };
  };

  // Refresh session - call this after backend login/register
  const refreshSession = async () => {
    // Force a fresh session fetch
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error refreshing session:", error);
      setUser(null);
      return null;
    }

    if (session?.user) {
      // new user context: invalidate cache if mismatch
      api.cache.clear();
      setUser(session.user);
      setLoading(false);
      return session.user;
    } else {
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
