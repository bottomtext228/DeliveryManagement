import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useAuth"
import useUserStore from "../../store/user/userStore";
export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    console.log(user);
    return <>
        <div className="flex md:flex-row flex-col py-16 md:gap-16 gap-8 max-w-[1440px] w-[90%]  mx-auto justify-center">
            <div className="lg:w-xl md:w-md md:max-w-full max-w-72 h-40 flex justify-between border border-gray-200 rounded-2xl">
                <div className="m-4">
                    <div className="w-14 h-14">
                        <img src="/squared_person.svg"></img>
                    </div>
                    <div className="font-semibold text-3xl pt-2">
                        Профиль:
                    </div>
                    <pre className="text-xl pt-2">
                        {user?.email}
                    </pre>
                </div>
                <div className="my-4 flex flex-col w-24 items-end mr-4">
                    <pre>
                        {user?.roles}
                    </pre>
                    <button onClick={() => {
                        navigate('/'); logout();
                    }} className="w-18 p-2 mt-auto rounded-lg text-rose-500 hover:text-white text-sm border border-rose-500 bg-white hover:bg-red-600 transition-colors duration-150">Выйти</button>
                </div>

            </div>
            <Link to='/catalog' className="md:w-44 md:max-w-full max-w-72 h-40 flex flex-col border border-gray-200 rounded-2xl transform transition-transform hover:scale-102 group">
                <img className="w-20 h-20 mx-auto m-4" src="/box.svg"></img>
                <div className="font-semibold mx-auto mt-auto text-2xl m-4 group-hover:text-amber-400">Товары</div>
            </Link>
            <Link to='/orders' className="md:w-44 md:max-w-full max-w-72 h-40 flex flex-col border border-gray-200 rounded-2xl transform transition-transform hover:scale-102 group">
                <img className="w-20 h-20 mx-auto m-4" src="/cart.svg"></img>
                <div className="font-semibold mx-auto mt-auto text-2xl m-4 group-hover:text-amber-400 ">Заказы</div>
            </Link>
        </div>
    </>
}