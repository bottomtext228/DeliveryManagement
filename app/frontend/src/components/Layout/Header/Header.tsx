import useUserStore from "../../../store/user/userStore";
import { removeTokenFromLocalStorage } from "../../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthState, useAuthState, useUser } from "../../../hooks/useAuth";
import Dropdown from "./Dropdown";
import Navbar from "./Navbar";

export default function Header() {
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const logoutHandler = () => {
        logout();
        removeTokenFromLocalStorage();
        navigate('/');
    }
   
    const user = useUser();

    return (
        <header className="border-b border-b-gray-200 min-h-16">
            <nav className="flex flex-wrap items-center justify-between lg:w-6xl md:w-3xl w-xl   mx-auto">
                <div className="flex w-full p-2 h-38 items-center">
                    <Navbar></Navbar>
                </div>
            </nav>
        </header>)
}