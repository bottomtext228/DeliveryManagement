import { useAuth, useUser } from "../../hooks/useAuth"
import useUserStore from "../../store/user/userStore";
export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    
    return <>
        <div className="flex p-16">
            <div className="w-xl h-40 flex justify-between border border-gray-200 rounded-2xl">
                <div className="m-4">
                    <div className="w-14 h-14">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                        </svg>
                    </div>
                    <div className="font-semibold text-xl">
                        Профиль:
                    </div>
                    <pre className="text-xl">
                        {user?.email}
                    </pre>
                </div>
                <div className="my-4 flex flex-col w-24 items-end mr-4">
                    <pre>
                        Покупатель
                    </pre>
                    <button onClick={() => logout()} className="w-18 p-2 mt-auto rounded-lg text-rose-500 hover:text-white text-sm border border-rose-500 bg-white hover:bg-red-600 transition-colors duration-150">Выйти</button>
                </div>

            </div>
            {/*   <button onClick={() => logout()} className="w-24 rounded-lg text-white text-lg font-semibold bg-red-500 hover:bg-red-600 p-1">Выйти</button> */}
        </div>
    </>
}