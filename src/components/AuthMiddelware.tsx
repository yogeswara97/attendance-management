// src/components/AuthMiddleware.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Set to true if user is signed in
            setLoading(false); // Stop loading once we have the auth state
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loader component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    return <>{children}</>; // Render the children if authenticated
};

export default AuthMiddleware;
