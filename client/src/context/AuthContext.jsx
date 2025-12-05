import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is a placeholder to check for an existing session on component mount.
        // In a real app, you might have an endpoint like '/api/auth/me' to get the current user.
        // For now, we'll just initialize as null.
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data.user);
    };

    const register = async (email, password, username) => {
        await axios.post('/api/auth/register', { email, password, username });
    };

    const logout = async () => {
        // We need an endpoint to clear the httpOnly cookie
        // await axios.post('/api/auth/logout'); 
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
