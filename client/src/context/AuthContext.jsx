import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch user data when token exists
    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/data`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // Immediately fetch user data after login
        try {
            const response = await axios.get(`${backendUrl}/api/user/data`, {
                headers: {
                    Authorization: newToken
                }
            });
            if (response.data.success) {
                setUser(response.data.user);
                // Store user data in localStorage for navigation purposes
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                return response.data.user; // Return user data
            }
        } catch (error) {
            console.error('Error fetching user data after login:', error);
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
