import { Link } from "react-router-dom";

export default function Footer() {
    return (

        <footer className="w-fit mx-auto flex items-center justify-center gap-4">

                <Link to='/' className="">
                    <img className="w-24 pt-1" src="/logo.png" alt="logo"></img>
                </Link>
                <div className="opacity-70 text-xs">
                    © {new Date().getFullYear()} Terrapin, Inc.
                </div>
                <Link to='/terms/' className="opacity-70 text-xs">
                    Terms
                </Link>
        </footer>
        /*      <div className="w-[80%] mx-auto">
                 <footer className="flex h-28 items-center border-t border-t-gray-200">
                     <div className="flex-2">
                         <Link to='/' className="flex items-center">
                             <img src="/logo.png" alt=""></img>
                         </Link>
                         <p className="text-gray-500">© {new Date().getFullYear()}</p>
                     </div>
     
     
                     <div className="flex-[0.5] flex flex-col gap-2">
                         <h5 className="text-xl font-medium mb-2">
                             Сайт
                         </h5>
                         <ul className="text-gray-500">
                             <li className="mb-2">
                                 <Link to='/'>Главная</Link>
                             </li>
                             <li className="mb-2">
                                 <Link to='/catalog'>Каталог</Link>
                             </li>
                         </ul>
                     </div>
     
                     <div className="flex-[0.5] flex flex-col gap-2">
                         <h5 className="text-xl font-medium mb-2">
                             Покупателям
                         </h5>
                         <ul className="text-gray-500">
                             <li className="mb-2">
                                 <Link to='/account'>Аккаунт</Link>
                             </li>
                             <li className="mb-2">
                                 <Link to='/orders'>Покупки</Link>
                             </li>
     
                         </ul>
                     </div>
     
                     <div className="flex-[0.5] flex flex-col gap-2">
                         <h5 className="text-xl font-medium mb-2">
                             Продавцам
                         </h5>
                         <ul className="text-gray-500">
                             <li className="mb-2">
                                 <Link to='/account'>Аккаунт</Link>
                             </li>
                             <li className="mb-2">
                                 <Link to='/catalog'>Товары</Link>
                             </li>
                             <li className="mb-2">
                                 <Link to='/map'>Карта складов</Link>
                             </li>
                         </ul>
                     </div>
                 </footer>
             </div> */
    )
}