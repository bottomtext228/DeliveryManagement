import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useAuth"
import useUserStore from "../../store/user/userStore";
export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();

    return <>
        <div className="flex md:flex-row flex-col py-16 md:gap-16 gap-8 max-w-[1440px] w-[90%]  mx-auto justify-center">
            <div className="flex justify-between h-40 border border-gray-200 lg:w-xl md:w-md md:max-w-full max-w-72 rounded-2xl">
                <div className="m-4">
                    <div className="w-14 h-14">
                        <img src="/squared_person.svg"></img>
                    </div>
                    <div className="pt-2 text-3xl font-semibold">
                        Профиль:
                    </div>
                    <pre className="pt-2 text-xl">
                        {user?.email}
                    </pre>
                </div>
                <div className="flex flex-col items-end w-24 my-4 mr-4">
                    <pre>
                        {user?.roles}
                    </pre>
                    <button onClick={() => {
                        navigate('/'); setTimeout(() => logout(), 100);
                    }} className="p-2 mt-auto text-sm transition-colors duration-150 bg-white border rounded-lg w-18 text-rose-500 hover:text-white border-rose-500 hover:bg-red-600">Выйти</button>
                </div>

            </div>
            <Link to='/catalog' className="flex flex-col h-40 transition-transform transform border border-gray-200 md:w-44 md:max-w-full max-w-72 rounded-2xl hover:scale-102 group">
                <img className="w-20 h-20 m-4 mx-auto" src="/box.svg"></img>
                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Товары</div>
            </Link>
            <Link to='/orders' className="flex flex-col h-40 transition-transform transform border border-gray-200 md:w-44 md:max-w-full max-w-72 rounded-2xl hover:scale-102 group">
                <img className="w-20 h-20 m-4 mx-auto" src="/cart.svg"></img>
                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400 ">Заказы</div>
            </Link>
        </div>
    </>
}