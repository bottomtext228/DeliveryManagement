import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuth) { navigate('/auth/login'); }
    }, [])

    if (!isAuth) return <></>;

    return children;
    /* return <>
        {isAuth ? children :
            <div>
                <h1>To view this page you must be logged in.</h1>
                <Link to='/auth/login' replace state={{ returnUrl: location, action: 'login' }} >Login</Link>
            </div>}
    </> */
}