import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
    children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuth = useAuth();
    const location = useLocation();
    /*    const navigate = useNavigate();
         useEffect(() => {
            if (!isAuth) { navigate('/auth/login'); }
        }, [])
    
        if (!isAuth) return <></>;
    
        return children; */
    return <>
        {isAuth ? children :
            <div>
                <h1>To view this page you must be logged in.</h1>
                <Link to='/auth/login' replace state={{ returnUrl: location }} >Login</Link>
            </div>}
    </>
}