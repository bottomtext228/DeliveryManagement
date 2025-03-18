import useUserStore from "../../store/user/userStore";
import { removeTokenFromLocalStorage } from "../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthState, useAuthState, useUser } from "../../hooks/useAuth";
import Dropdown from "./Dropdown";

export default function Header() {
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const logoutHandler = () => {
        logout();
        removeTokenFromLocalStorage();
        navigate('/');
    }
    const authState = useAuthState();
    const user = useUser();

    return (
        <header className="bg-gray-50 border-b border-b-gray-200">
            <nav className="flex flex-wrap items-center justify-between w-8xl mx-auto">
                <div className="flex w-full p-2 h-38 items-center">
                    <a><img src="/logo.png" className=""></img></a>
                    <div className="ml-5">
                        <ul className="flex h-full items-center">
                            <li className="p-2">
                                <Link to='/'>Главная</Link>
                            </li>
                            <li className="p-2">
                                <Link to='/catalog'>Каталог</Link>
                            </li>
                            <li className="p-2">
                                <Link to='/about'>О нас</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="ml-auto">
                        {authState == AuthState.AUTHORIZED &&
                            <div className="">
                                <Link to='/account'>Профиль</Link>
                            </div>}
                        {/*   @if (User.Identity.IsAuthenticated)
                    {
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" asp-controller="Account" asp-action="Profile">Профиль</a>
                        </li>
                    }
                    else
                    {

                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" asp-controller="Account" asp-action="Login">Вход</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link " aria-current="page" asp-controller="Account" asp-action="Register">Регистрация</a>
                        </li>

                    } */}

                        {/*            <div className="relative inline-block text-left">
                            <div>
                                <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                    Options
                                    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>


                            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                <div className="py-1" role="none">

                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Edit</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-1">Duplicate</a>
                                </div>
                                <div className="py-1" role="none">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-2">Archive</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-3">Move</a>
                                </div>
                                <div className="py-1" role="none">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-4">Share</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-5">Add to favorites</a>
                                </div>
                                <div className="py-1" role="none">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-6">Delete</a>
                                </div>
                            </div>
                        </div> */}

                        <div className="">
                            <Dropdown></Dropdown>

                        </div>


                        {location.pathname == '/auth/login' && <>
                            <div>
                                Нет аккаунта? <Link to='/auth/register' className="text-blue-600 hover:text-blue-700 hover:underline">Создать</Link>
                            </div>
                        </>}


                        {location.pathname == '/auth/register' && <>
                            <div>
                                Уже есть аккаунт? <Link to='/auth/login' className="text-blue-600 hover:text-blue-700 hover:underline">Войти</Link>
                            </div>
                        </>}
                    </div>
                    {/*             <div className="btn-group">
                        <button type="button" className="btn btn-light dropdown-toggle" id="dropdownMenuClickableOutside"
                            data-bs-toggle="dropdown" data-bs-auto-close="inside" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuClickableOutside">
                            <li>
                                <button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#modalSignin">
                                    Вход
                                    в аккаунт
                                </button>
                            </li>
                            <li>
                                <hr className="dropdown-divider"></hr>
                            </li>
                            <li><a className="nav-link" aria-current="page" asp-controller="Account" asp-action="Profile"><button className="dropdown-item" type="button">Аккаунт</button></a></li>
                            <li>@* TODO: Basket  *@<button className="dropdown-item" type="button">Корзина</button></li>
                            <li><a className="nav-link" aria-current="page" asp-controller="Order" asp-action="All"><button className="dropdown-item" type="button">Заказы</button></a></li>
                            <li>
                                <hr className="dropdown-divider"></hr>
                            </li>
                            <li><button className="dropdown-item text-danger" type="button">Выйти</button></li>
                        </ul>

                    </div> */}
                </div>
            </nav>
        </header>)
}