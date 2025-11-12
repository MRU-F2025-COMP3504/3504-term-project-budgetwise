import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../../lib/helpers/DatabaseConnector";

// Creating the context, checking the authentication context
const AuthContext = createContext({});

//Creating hook for the auth context
export function useAuth() {
    return useContext(AuthContext);
}

// Creating the provider component 
export function AuthProvider({ children }) {
    //state to hold user data
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false); // tells app we're done loading
        };

        checkSession();
    }, []);

    // Listener to check when login user changes 
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Login function
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    };

    // Register function
    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        return { data, error };
    };

    // Logout function
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        setUser(null);
        return { error };
    };

    // Refresh session - call this after backend login/register
    const refreshSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(session.user);
        } else {
            setUser(null);
        }
        return session?.user;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        refreshSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}