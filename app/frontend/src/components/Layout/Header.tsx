import useUserStore from "../../store/user/userStore";
import { removeTokenFromLocalStorage } from "../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../../hooks/useAuth";

export default function Header() {
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const logoutHandler = () => {
        logout();
        removeTokenFromLocalStorage();
        navigate('/');
    }
    const isAuth = useAuth();
    const getUser = useUser();

    return <div className="flex items-center h-10">
        <div className="w-8"><Link to='/'><img src="/emblem.svg" ></img></Link></div>
        {location.pathname !== '/auth' /* don't render sign in/sign up/etc buttons when authenticating */
            ?
            isAuth ?
                <div className="ml-auto">
                    <span>{getUser?.email}</span>
                    <button className="ml-3 border rounded-lg p-1" onClick={logoutHandler}>Logout</button>
                </div>
                :
                <div className="ml-auto">
                    <div className="border rounded-lg p-1">
                        <Link className="hover:underline" to='/auth' state={{ action: 'login' }} >Sign in</Link> / <Link className="hover:underline" to='/auth' state={{ action: 'register' }}>Sign up</Link>
                    </div>
                </div>
            :
            <></>
        }

    </div>
}