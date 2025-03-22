import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthState, useAuthState } from "../../../hooks/useAuth";
import Dropdown from "./Dropdown";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const authState = useAuthState();

    return (

        <>
            <nav id='nav' className={`md:flex md:justify-around md:static  md:items-center md:bg-transparent bg-white p-0.5 md:w-8xl md:max-w-full md:h-24 h-full fixed top-0 w-full max-w-[15em] ${isOpen ? 'right-0' : '-right-full'} z-10 transition-all duration-300 ease-in-out`}>
                <div className="md:flex md:justify-center md:items-center">
                    <Link className="md:block hidden" to='/'><img src="/logo.png" className="w-64"></img></Link>
                    <button className="md:hidden flex w-8 h-8 opacity-75 justify-center items-center" onClick={() => setIsOpen(false)}>
                        <img src='/cross.svg' className="w-4 h-4"></img>
                    </button>
                    <ul className="md:flex block ">
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
                <div className="">
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
