import { Navigate, useLocation } from "react-router-dom";
import { AuthState, useAuthState } from "../../hooks/useAuthState"
import Loading from "../Loading/Loading";
import { PropsWithChildren } from "react";
import { useUser } from "../../hooks/useUser";



export const ProtectedRoute = ({ allowedRoles, children }: PropsWithChildren & {
    allowedRoles?: string[]
}) => {
    const authState = useAuthState();
    const user = useUser();
    const location = useLocation();

    if (authState === AuthState.PENDING) return <Loading></Loading>
    if (authState == AuthState.NOT_AUTHORIZED || (allowedRoles && !allowedRoles.some(e => user?.roles.includes(e)))) {


        return (<>
            <Navigate to='/auth/login' replace={true} state={{ returnUrl: location }}></Navigate>
        </>)
    }

    return children;

}