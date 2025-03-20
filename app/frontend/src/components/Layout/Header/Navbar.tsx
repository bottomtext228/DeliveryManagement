import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthState, useAuthState } from "../../../hooks/useAuth";
import Dropdown from "./Dropdown";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const authState = useAuthState();


    return (

        <>
            <nav>
                <Link to='/'><img src="/logo.png" className=""></img></Link>
                <div className="ml-5">
                    {isOpen ?
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
                        : <></>}
                </div>
                <div className="ml-auto">
                    {authState == AuthState.AUTHORIZED &&
                        <div className="">
                            <Link to='/account'>Профиль</Link>
                        </div>}

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
            </nav>
        </>
    )
}
