import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../../store/user/userStore';
import { useUser } from '../../../hooks/useUser';
import RoleBadge from '../../Role/RoleBadge';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const logout = useUserStore(store => store.logout);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useUser();

    // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        window.addEventListener('mousedown', handler);
        return () => window.removeEventListener('mousedown', handler);
    }, []);

    function handleClick() {
        setIsOpen(false);
    }
    
    return (<>
        <div ref={dropdownRef} className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className={`w-20 rounded-lg px-3 py-1.5 border border-transparent hover:border-neutral-400  hover:bg-neutral-300 ${isOpen && 'bg-gray-300'} flex justify-center items-center mx-auto duration-300 transition-all`}>
                <img className="w-10 h-10" src="/person.svg"></img>
                <img className={`w-4 h-4 rotate-${isOpen ? '180' : '0'} transition-all duration-200`} src='/caret-down.svg'></img>
            </button>
            {isOpen &&
                <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y-[1px] divide-gray-300  rounded-md  bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                    {user ?
                        <div>
                            <div className="w-full px-4 py-1 text-left text-black opacity-85">
                                <div className='font-semibold text-ellipsis whitespace-pre-wrap overflow-hidden'>{user?.email}</div>
                                <RoleBadge roles={user.roles}></RoleBadge>
                            </div>
                        </div> :
                        <Link onClick={handleClick} to='/auth/login' className='block px-4 py-2 opacity-85 hover:bg-neutral-200'>
                            Войти в аккаунт
                        </Link>
                    }
                    <div className='flex flex-col'>
                        {user && <Link onClick={handleClick} to='/account' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Аккаунт</Link>}
                        {user?.roles.includes('company') && <>
                            <Link onClick={handleClick} to='/map' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Карта</Link>
                        </>}
                        {user?.roles.includes('client') &&
                            <>
                                <Link onClick={handleClick} to='/cart' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Корзина</Link>
                                <Link onClick={handleClick} to='/orders' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Заказы</Link>
                            </>
                        }
                    </div>
                    {user &&
                        <div>
                            <button onClick={() => { setIsOpen(false); navigate('/'); setTimeout(() => logout(), 100); }} className="w-full px-4 py-1 my-1 text-left text-red-600 opacity-85 hover:bg-neutral-200" type="button">Выйти</button>
                        </div>
                    }
                </div>
            }
        </div>
    </>

    )
}
