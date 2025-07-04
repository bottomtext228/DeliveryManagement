import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import useUserStore from "../../store/user/userStore";
import RoleBadge from "../../components/Role/RoleBadge";
export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();

    if (!user) return;

    return <>
        <div className="flex md:flex-row flex-col py-16 lg:gap-16 gap-8 max-w-[1440px] w-[90%]  mx-auto justify-center">
            <div className="flex sm:flex-row flex-col gap-x-8 p-4 justify-between border border-gray-200 max-w-full md:w-xl md:max-w-124 h-fit rounded-2xl">
                <div className="">
                    <div className="w-14 h-14">
                        <img src="/squared_person.svg"></img>
                    </div>
                    <div className="pt-2 text-3xl font-semibold">
                        Профиль:
                    </div>
                    <div className="pt-2 text-xl break-all font-mono">
                        {user.email}
                    </div>
                </div>
                <div className="flex flex-col justify-around items-end">
                    <pre>
                        <RoleBadge roles={user.roles}></RoleBadge>
                    </pre>
                    {user.company &&
                        <div className="pt-2 text-lg mb-2">
                            {user.company.name}
                        </div>
                    }
                    <button onClick={() => {
                        navigate('/'); setTimeout(() => logout(), 100);
                    }} className="p-2 mt-auto text-sm transition-colors duration-150 bg-white border rounded-lg w-18 text-rose-500 hover:text-white border-rose-500 hover:bg-red-600">
                        Выйти
                    </button>
                </div>
            </div>
            {user.roles.includes('company') &&
                <>
                    <Link to='/catalog' className="flex flex-col h-40 transition-transform transform border border-gray-200 max-w-full md:w-44 rounded-2xl hover:scale-102 group">
                        <img className="w-20 h-20 m-4 mx-auto" src="/box.svg"></img>
                        <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Товары</div>
                    </Link>
                    <Link to='/map' className="flex flex-col h-40 transition-transform transform border border-gray-200 max-w-full md:w-44 rounded-2xl hover:scale-102 group">
                        <img className="w-20 h-20 m-4 mx-auto" src="/location.svg"></img>
                        <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Карта</div>
                    </Link>
                </>
            }

            {user.roles.includes('client') &&
                <>
                    <Link to='/orders' className="flex flex-col h-40 transition-transform transform border border-gray-200 max-w-full md:w-44 rounded-2xl hover:scale-102 group">
                        <img className="w-20 h-20 m-4 mx-auto" src="/cart.svg"></img>
                        <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400 ">Заказы</div>
                    </Link>
                </>
            }
        </div>
    </>
}