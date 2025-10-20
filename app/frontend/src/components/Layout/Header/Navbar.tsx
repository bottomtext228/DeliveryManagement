import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import RoleBadge from '../../Role/RoleBadge';
import useUserStore from '../../../store/user/userStore';
import { useAuthState, AuthState } from '../../../hooks/useAuthState';
import { useUser } from '../../../hooks/useUser';
import { CloseButton } from '../../Common/CloseButton';


export default function Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const user = useUser();
    const authState = useAuthState();

    function handleNavbarClick() {
        setIsNavbarOpen(false);
    }

    function handleDropdownClick() {
        setIsDropdownOpen(false);
    }


    return (
        <>
            <button className="mr-auto md:hidden" onClick={() => setIsNavbarOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/bars.svg'></img>
            </button>
            <button className='ml-auto md:hidden' onClick={() => setIsDropdownOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/person.svg'></img>
            </button>
            <div className={`md:hidden bg-white p-0.5 h-full fixed top-0 w-full max-w-[15em] ${isDropdownOpen ? 'right-0' : '-right-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className='relative flex h-8 text-center items-center'>
                    <button className="float-left absolute transform items-center justify-center w-8 h-8 p-2 md:hidden z-10" onClick={() => setIsDropdownOpen(false)}>
                        <CloseButton />
                    </button>
                    <div className='w-full text-lg opacity-80'>Меню профиля</div>
                </div>

                {authState == AuthState.AUTHORIZED && user ? <>
                    <div className='p-2 font-mono flex flex-col gap-y-1 border rounded-lg border-gray-300 w-[90%] mx-auto'>
                        <div>{user.email}</div>
                        <RoleBadge roles={user.roles}></RoleBadge>
                        <button onClick={() => {
                            setIsDropdownOpen(false); navigate('/auth/login'); setTimeout(() => logout(), 100);
                        }} className="p-2 mt-auto text-sm transition-colors duration-150 bg-white border rounded-lg w-18 text-rose-500 hover:text-white border-rose-500 hover:bg-red-600">
                            Выйти
                        </button>
                    </div>

                    <ul className='mt-1.5 font-semibold'>
                        <li className='p-2'>
                            <NavLink to='/account' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Аккаунт</NavLink>
                        </li>
                        {user.roles.includes('company') && <>
                            <li className='p-2'>
                                <NavLink to='/map' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Карта</NavLink>
                            </li>
                        </>}
                        {user.roles.includes('client') &&
                            <>
                                <li className='p-2'>
                                    <NavLink to='/cart' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Корзина</NavLink>
                                </li>
                                <li className='p-2'>
                                    <NavLink to='/orders' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Заказы</NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </>
                    :
                    <>
                        <ul className='mt-1.5 font-semibold'>
                            <li className='p-2'>
                                <NavLink to='/auth/login' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Войти</NavLink>
                            </li>
                            <li className='p-2'>
                                <NavLink to='/auth/register' state className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Создать аккаунт</NavLink>
                            </li>
                        </ul>
                    </>
                }




            </div >

            <nav id='nav' className={`md:flex md:justify-around md:static  md:items-center md:bg-transparent bg-white p-0.5 md:w-8xl md:max-w-full md:h-24 h-full fixed top-0 w-full max-w-[15em] ${isNavbarOpen ? 'left-0' : '-left-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className="md:flex md:justify-center md:items-center">
                    <Link className="hidden md:block" to='/'><img src="/logo.png" className="w-64"></img></Link>
                    <div className='relative flex h-8 text-center items-center'>
                        <button className="float-left absolute flex transform items-center justify-center w-8 h-8 p-2 z-10 md:hidden" onClick={() => setIsNavbarOpen(false)}>
                            <CloseButton />
                        </button>
                        <div className='w-full text-lg opacity-80 mx-auto md:hidden'>Навигация</div>
                    </div>
                    <ul className="block mt-1.5 md:flex md:ml-2 md:mt-0 font-semibold">
                        <li className="flex items-center justify-center p-2 w-18">
                            <NavLink to='/' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleNavbarClick}>Главная</NavLink>
                        </li>
                        <li className="flex items-center justify-center p-2 w-18">
                            <NavLink to='/catalog' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleNavbarClick}>Каталог</NavLink>
                        </li>
                        <li className="flex items-center justify-start p-2 w-18">
                            <NavLink to='/about' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleNavbarClick}>О нас</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="hidden md:block">
                    <Dropdown></Dropdown>
                </div>
            </nav >
            <div id="overlay" onClick={() => { setIsDropdownOpen(false); setIsNavbarOpen(false); }} className={`fixed z-[9] inset-0 ${isNavbarOpen || isDropdownOpen ? 'block' : 'hidden'} bg-[rgba(0,0,0,0.1)] transition-colors duration-300`}></div>
        </>
    )
}
