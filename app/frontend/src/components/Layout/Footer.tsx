import { Link } from "react-router-dom";

export default function Footer() {
    return (<div className="w-[80%] mx-auto">
        <footer className="flex h-60 items-center border-t border-t-gray-200">
            <div className="flex-2">
                <Link to='/' className="flex items-center">
                    <img src="/logo.png" alt=""></img>
                </Link>
                <p className="text-gray-500">© {new Date().getFullYear()}</p>
            </div>


            <div className="flex-[0.5] h-36 w-36">
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

            <div className="flex-[0.5] h-36">
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

            <div className="flex-[0.5] h-36">
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
    </div>
    )
}