import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import useUserStore from "../../store/user/userStore";
import RoleBadge from "../../components/Role/RoleBadge";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../../components/Error/ErrorPage";
import CompanyInfo from "../../components/Account/CompanyInfo";
import { ClientProfileDto, CompanyProfileDto } from "../../types/types";
import CompanyProfileCard from "../../components/Account/CompanyProfileCard";
import ClientProfileCard from "../../components/Account/ClientProfileCard";
import { useProfile } from "../../hooks/queries/useProfile";
import { NavCard } from "../../components/Common/NavCard";

export default function Account() {
    const user = useUser();
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useProfile();

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
                            navigate('/auth/login'); setTimeout(() => logout(), 100);
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
                            <NavCard link="/catalog" image="/box.svg" label="Товары" />
                            <NavCard link="/map" image="/location.svg" label="Карта" />
                        </>
                    }

                    {user.roles.includes('client') &&
                        <>
                            <NavCard link="/orders" image="/box.svg" label="Заказы" />
                            <NavCard link="/map" image="/cart.svg" label="Корзина" />
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