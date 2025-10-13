import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import useUserStore from "../../store/user/userStore";
import RoleBadge from "../../components/Role/RoleBadge";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "../../queries/profile.query";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../../components/Error/ErrorPage";
import useCartStore from "../../store/user/cartStore";
import CompanyInfo from "../../components/Account/CompanyInfo";
import { ClientProfileDto, CompanyProfileDto } from "../../types/types";
import CompanyProfileCard from "../../components/Account/CompanyProfileCard";
import ClientProfileCard from "../../components/Account/ClientProfileCard";

export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const cartList = useCartStore(state => state.list);

    const { data, isLoading, isError, error } = useQuery({ ...profileQueryOptions(), select: (e) => e.data });

    if (isLoading) return <Loading />;

    if (isError) return <ErrorPage message={error.message} />;

    if (!user) return <ErrorPage message="User object is empty" />;

    // TODO: add more info to account page, maybe add a new endpoint for that info.
    return <>
        <div className="flex md:flex-row flex-col py-16 lg:gap-16 gap-8 max-w-[1440px] w-[90%] mx-auto justify-center">
            <div className="flex flex-col gap-8">
                <div className="flex sm:flex-row flex-col gap-x-8 p-4 justify-between border border-gray-200 max-w-full md:w-2xl h-fit rounded-2xl">
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
                    <div className="flex flex-col justify-around sm:items-end items-start">
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

                <div className="flex px-4 py-2 border border-gray-200 rounded-2xl">
                    {user.roles.includes('company') &&
                        <CompanyProfileCard data={data as CompanyProfileDto} />
                    }
                    
                    {user.roles.includes('client') &&
                        <ClientProfileCard data={data as ClientProfileDto} />
                    }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    {user.roles.includes('company') &&
                        <>
                            <Link to='/catalog' className="flex flex-col h-40 transition-transform transform border border-gray-200 rounded-2xl hover:scale-102 group">
                                <img className="w-20 h-20 m-4 mx-auto" src="/box.svg"></img>
                                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Товары</div>
                            </Link>
                            <Link to='/map' className="flex flex-col h-40 transition-transform transform border border-gray-200 rounded-2xl hover:scale-102 group">
                                <img className="w-20 h-20 m-4 mx-auto" src="/location.svg"></img>
                                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Карта</div>
                            </Link>

                        </>
                    }

                    {user.roles.includes('client') &&
                        <>
                            <Link to='/orders' className="flex flex-col h-40 transition-transform transform border border-gray-200 rounded-2xl hover:scale-102 group">
                                <img className="w-20 h-20 m-4 mx-auto" src="/box.svg"></img>
                                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400">Заказы</div>
                            </Link>
                            <Link to='/cart' className="flex flex-col h-40 transition-transform transform border border-gray-200 rounded-2xl hover:scale-102 group">
                                <img className="w-20 h-20 m-4 mx-auto" src="/cart.svg"></img>
                                <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400 ">Корзина</div>
                            </Link>
                        </>
                    }
                </div>
                {user.roles.includes('company') &&
                    <CompanyInfo company={user.company!} />
                }
            </div>
        </div >
    </>
}