import { useAuth, useUser } from "../../hooks/useAuth"
import useUserStore from "../../store/user/userStore";
export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
   return <>
        <div>
            {user?.email}
        </div>
        <button onClick={() => logout()} className="w-24 rounded-lg text-white text-lg font-semibold bg-red-500 hover:bg-red-600 p-1">Выйти</button>
    </>
}