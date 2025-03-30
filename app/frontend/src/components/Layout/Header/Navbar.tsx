import { useState } from 'react'
import { AuthState, useAuthState } from '../../../hooks/useAuth'
import { Link, NavLink, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';

interface NavigationItem {
    name: string,
    link: string,
    current: boolean
}

export default function Navbar() {
    const location = useLocation();
    const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('');

    const authState = useAuthState();
    function handleNavbarClick(/* item: NavigationItem */) {
        /*     navigationList.forEach(item => item.current = false);
            item.current = true; */
        setIsNavbarOpen(false);
        /*     console.log(navigationList); */
    }

    const navigationList: NavigationItem[] = [
        {
            name: 'Главная',
            link: '/',
            current: true
        },
        {
            name: 'Каталог',
            link: '/catalog',
            current: false
        }, {
            name: 'О нас',
            link: '/about',
            current: false
        }
    ];

    function handleDropdownClick() {
        setIsDropdownOpen(false);
    }
    return (
        <>
            <button className='mr-auto md:hidden' onClick={() => setIsDropdownOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/person.svg'></img>
            </button>
            <button className="ml-auto md:hidden" onClick={() => setIsNavbarOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/bars.svg'></img>
            </button>
            <div className={`md:hidden bg-white p-0.5 h-full fixed top-0 w-full max-w-[15em] ${isDropdownOpen ? 'left-0' : '-left-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className='relative flex h-8 text-center'>
                    <button className="absolute left-0 top-[50%] -translate-y-[50%] flex transform items-center justify-center w-8 h-8 opacity-75 md:hidden z-10" onClick={() => setIsDropdownOpen(false)}>
                        <img src='/cross.svg' className="w-4 h-4"></img>
                    </button>
                    <div className='w-full text-lg opacity-80'>Меню профиля</div>


                </div>
                <ul className='mt-1.5'>

                    <li className='p-2'>
                        <NavLink to='/account' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Аккаунт</NavLink>
                    </li>
                    <li className='p-2'>
                        <NavLink to='/cart' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Корзина</NavLink>
                    </li>
                    <li className='p-2'>
                        <NavLink to='/orders' className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400 font-semibold' : 'hover:text-orange-400'} onClick={handleDropdownClick}>Заказы</NavLink>
                    </li>
                </ul>
            </div >

            <nav id='nav' className={`md:flex md:justify-around md:static  md:items-center md:bg-transparent bg-white p-0.5 md:w-8xl md:max-w-full md:h-24 h-full fixed top-0 w-full max-w-[15em] ${isNavbarOpen ? 'right-0' : '-right-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className="md:flex md:justify-center md:items-center">
                    <Link className="hidden md:block" to='/'><img src="/logo.png" className="w-64"></img></Link>
                    <div className='relative flex h-8 text-center'>
                        <button className="absolute left-0 top-[50%] -translate-y-[50%] flex transform items-center justify-center w-8 h-8 opacity-75 z-10 md:hidden" onClick={() => setIsNavbarOpen(false)}>
                            <img src='/cross.svg' className="w-4 h-4"></img>
                        </button>
                        <div className='w-full text-lg opacity-80 md:hidden'>Навигация</div>
                    </div>
                    <ul className="block mt-1.5 md:flex md:ml-2 md:mt-0">
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
