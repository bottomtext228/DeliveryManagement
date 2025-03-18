import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Dropdown() {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (<>
        <div ref={dropdownRef} className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className={`border border-gray-200 rounded-2xl p-2 hover:bg-neutral-200 ${isOpen && 'bg-neutral-200'}`}>
                <img className="w-12 h-12" src="/person.svg"></img>
            </button>

            {isOpen &&
                <div className="absolute right-2 z-10 mt-2 w-40 origin-top-right divide-y-[1px] divide-gray-300  rounded-md  bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                    <div>
                        <button className="px-4 w-full text-left py-1 my-1 opacity-85 hover:bg-neutral-200" type="button">
                            Вход в аккаунт
                        </button>
                    </div>
                    <div className='flex flex-col'>
                        <Link to='/account' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Аккаунт</Link>
                        <Link to='/cart' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Корзина</Link>
                        <Link to='/orders' className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200">Заказы</Link>
                    </div>
                    <div>
                        <button className="px-4 w-full text-left py-1 my-1 opacity-85 text-red-600 hover:bg-neutral-200" type="button">Выйти</button>
                    </div>
                </div>
            }
        </div>
    </>

    )
}
