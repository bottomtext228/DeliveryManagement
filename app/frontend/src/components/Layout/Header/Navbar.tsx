import { useState } from 'react'
import { AuthState, useAuthState } from '../../../hooks/useAuth'
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
export default function Navbar() {
    const location = useLocation();
    const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const authState = useAuthState();

    return (
        <>
            <button className='mr-auto md:hidden' onClick={() => setIsDropdownOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/person.svg'></img>
            </button>
            <button className="ml-auto md:hidden" onClick={() => setIsNavbarOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='/bars.svg'></img>
            </button>
            <div className={`md:hidden bg-white p-0.5 h-full fixed top-0 w-full max-w-[15em] ${isDropdownOpen ? 'left-0' : '-left-full'} z-50 transition-all duration-300 ease-in-out`}>
                <button className="flex items-center justify-center w-8 h-8 opacity-75 md:hidden" onClick={() => setIsDropdownOpen(false)}>
                    <img src='/cross.svg' className="w-4 h-4"></img>
                </button>

                <ul>
                    <li className='p-2'>
                        <Link to='/cart'>Корзина</Link>
                    </li>
                    <li className='p-2'>
                        <Link to='/orders'>Заказы</Link>
                    </li>
                </ul>
            </div >

            <nav id='nav' className={`md:flex md:justify-around md:static  md:items-center md:bg-transparent bg-white p-0.5 md:w-8xl md:max-w-full md:h-24 h-full fixed top-0 w-full max-w-[15em] ${isNavbarOpen ? 'right-0' : '-right-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className="md:flex md:justify-center md:items-center">
                    <Link className="hidden md:block" to='/'><img src="/logo.png" className="w-64"></img></Link>
                    <button className="flex items-center justify-center w-8 h-8 opacity-75 md:hidden" onClick={() => setIsNavbarOpen(false)}>
                        <img src='/cross.svg' className="w-4 h-4"></img>
                    </button>
                    <ul className="block md:flex ">
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
                <div className="hidden md:block">
                    <Dropdown></Dropdown>
                </div>
            </nav>
            <div id="overlay" onClick={() => { setIsDropdownOpen(false); setIsNavbarOpen(false); }} className={`fixed z-[9] inset-0 ${isNavbarOpen || isDropdownOpen ? 'block' : 'hidden'} bg-[rgba(0,0,0,0.1)] transition-colors duration-300`}></div>
        </>
    )
}
