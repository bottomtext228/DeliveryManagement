import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
    children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuth = useAuth();
    const location = useLocation();
    
    return <>
        {isAuth ? children :
            <div>
                <h1>To view this page you must be logged in.</h1>
                <Link to='/auth/login' replace state={{ returnUrl: location, action: 'login' }} >Login</Link>
            </div>}
    </>
}