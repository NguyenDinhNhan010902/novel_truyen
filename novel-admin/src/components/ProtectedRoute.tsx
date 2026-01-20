import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const token = localStorage.getItem('access_token');

    // Basic check: if no token, redirect to login
    // For stricter check, we could Verify the token with API here, 
    // but usually API interceptor handles 401 -> Logout.

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
