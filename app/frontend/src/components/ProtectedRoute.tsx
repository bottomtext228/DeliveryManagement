import { Link, useLocation } from "react-router-dom";
import { AuthState, useAuthState, useUser } from "../hooks/useAuth"
import Loading from "./Loading/Loading";
import { PropsWithChildren } from "react";



export const ProtectedRoute = ({ allowedRoles, children }: PropsWithChildren & {
    allowedRoles?: string[]
}) => {
    const authState = useAuthState();
    const user = useUser();
    const location = useLocation();
    /*    const navigate = useNavigate();
         useEffect(() => {
            if (!isAuth) { navigate('/auth/login'); }
        }, [])
    
        if (!isAuth) return <></>;
    
        return children; */
    if (authState === AuthState.PENDING) return <Loading></Loading>
    if (authState == AuthState.NOT_AUTHORIZED || (allowedRoles && !allowedRoles.some(e => user?.roles.includes(e)))) {
        return (<>
            <div >
                <h1>Нет доступа.</h1>
                <Link to='/auth/login' replace state={{ returnUrl: location }} >Login</Link>
            </div >
        </>)
    }

    return children;

}