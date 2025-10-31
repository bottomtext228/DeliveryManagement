import { useState } from 'react'
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import RoleBadge from '../../Role/RoleBadge';
import { useAuthState, AuthState } from '../../../hooks/useAuthState';
import { useUser } from '../../../hooks/useUser';
import { CloseButton } from '../../Common/CloseButton';
import NavLinkItem from '../../Common/NavLinkItem';
import LogoutButton from '../../Common/LogoutButton';


export default function Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
                        <RoleBadge roles={user.roles} />
                        <LogoutButton onClick={() => setIsDropdownOpen(false)} />
                    </div>

                    <ul className='mt-1.5 font-semibold'>
                        <NavLinkItem label='Аккаунт' link='/account' onClick={handleDropdownClick} />
                        {user.roles.includes('company') && <>
                            <NavLinkItem label='Карта' link='/map' onClick={handleDropdownClick} />
                        </>}
                        {user.roles.includes('client') &&
                            <>
                                <NavLinkItem label='Корзина' link='/cart' onClick={handleDropdownClick} />
                                <NavLinkItem label='Заказы' link='/orders' onClick={handleDropdownClick} />
                            </>
                        }
                    </ul>
                </>
                    :
                    <ul className='mt-1.5 font-semibold'>
                        <NavLinkItem label='Войти' link='/auth/login' onClick={handleDropdownClick} />
                        <NavLinkItem label='Создать аккаунт' link='/auth/register' onClick={handleDropdownClick} />
                    </ul>
                }
            </div >

            <nav id='nav' className={`md:flex md:justify-around md:static  md:items-center md:bg-transparent bg-white p-0.5 md:w-8xl md:max-w-full md:h-24 h-full fixed top-0 w-full max-w-[15em] ${isNavbarOpen ? 'left-0' : '-left-full'} z-50 transition-all duration-300 ease-in-out`}>
                <div className="md:flex md:justify-center md:items-center">
                    <Link className="hidden md:block" to='/'><img src="/logo.png" className="w-64 active:scale-99" draggable={false}></img></Link>
                    <div className='relative flex h-8 text-center items-center'>
                        <button className="float-left absolute flex transform items-center justify-center w-8 h-8 p-2 z-10 md:hidden" onClick={() => setIsNavbarOpen(false)}>
                            <CloseButton />
                        </button>
                        <div className='w-full text-lg opacity-80 mx-auto md:hidden'>Навигация</div>
                    </div>
                    <ul className="block mt-1.5 md:flex md:ml-2 md:mt-0 font-semibold">
                        <NavLinkItem label='Главная' link='/' onClick={handleNavbarClick} />
                        <NavLinkItem label='Каталог' link='/catalog' onClick={handleNavbarClick} />
                        <NavLinkItem label='О нас' link='/about' onClick={handleNavbarClick} />
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
