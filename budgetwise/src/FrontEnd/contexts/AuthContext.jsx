import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../../lib/helpers/DatabaseConnector";
import api from "../services/api";

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

    // Check for existing session and handle email confirmation
    useEffect(() => {
        const checkSession = async () => {
            // First, check if there's a hash in the URL (from email confirmation)
            if (typeof window !== 'undefined' && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                
                // If we have tokens in the URL, exchange them for a session
                if (accessToken && refreshToken) {
                    try {
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });
                        
                        if (error) {
                            console.error('Error setting session from tokens:', error);
                        } else if (data.session) {
                            setUser(data.session.user);
                            
                            // Clean the URL hash
                            window.history.replaceState(null, '', window.location.pathname);
                            
                            // Check if user has a profile
                            try {
                                const profileResponse = await api.profile.get();
                                const hasProfile = profileResponse?.data?.profile && 
                                                  Object.keys(profileResponse.data.profile).length > 0;
                                
                                if (!hasProfile) {
                                    // New user, redirect to quiz
                                    window.location.href = '/quiz';
                                    return;
                                }
                            } catch (profileError) {
                                // No profile found, redirect to quiz
                                console.log('No profile found after email confirmation, redirecting to quiz');
                                window.location.href = '/quiz';
                                return;
                            }
                        }
                    } catch (err) {
                        console.error('Error handling email confirmation:', err);
                    }
                }
            }
            
            // Check for existing session
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
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    
                    // Check if user just signed in (including email verification)
                    if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
                        // Check if user has completed the quiz by checking their profile
                        try {
                            const profileResponse = await api.profile.get();
                            const hasProfile = profileResponse?.data?.profile && 
                                              Object.keys(profileResponse.data.profile).length > 0;
                            
                            // If no profile exists, redirect to quiz
                            if (!hasProfile && window.location.pathname !== '/quiz') {
                                window.location.href = '/quiz';
                            }
                        } catch (error) {
                            // If profile check fails (likely no profile), redirect to quiz
                            console.log('No profile found, redirecting to quiz');
                            if (window.location.pathname !== '/quiz') {
                                window.location.href = '/quiz';
                            }
                        }
                    }
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
        // Force a fresh session fetch
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error refreshing session:', error);
            setUser(null);
            return null;
        }
        
        if (session?.user) {
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
        refreshSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}