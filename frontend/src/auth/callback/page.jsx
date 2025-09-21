import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Create a URLSearchParams object to easily access query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            console.log("Token received from URL:", token);
            // Store the token in localStorage so it persists
            localStorage.setItem('authToken', token);

            // Redirect user to the main dashboard or home page
            // The replace: true option prevents the user from going back to this page
            navigate('/', { replace: true });
        } else {
            // Handle the case where no token was provided
            console.error("Authentication failed, no token found.");
            navigate('/login', { replace: true });
        }
    }, [location, navigate]); // Dependencies for the useEffect hook

    // You can render a simple loading indicator while the logic runs
    return <div>Loading...</div>;
};

export default AuthCallback;