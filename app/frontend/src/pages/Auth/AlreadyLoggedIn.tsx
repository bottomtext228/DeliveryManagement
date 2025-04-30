import { Link, useNavigate } from "react-router-dom";

export default function AlreadyLoggedIn() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto w-96 md:my-16 my-4 gap-y-10 flex flex-col items-center justify-center h-36 border border-gray-200 rounded-xl p-3">
            <div className="text-xl font-semibold">
                Вы уже вошли в аккаунт.
            </div>
            <div className="flex gap-8">
                <Link to='/' className="bg-amber-500  p-2 rounded-lg text-white font-semibold text-lg  hover:bg-amber-600 w-24 text-center">Главная</Link>
                <button onClick={() => navigate(-1)} className="bg-neutral-500 p-2 rounded-lg text-white font-semibold text-lg hover:bg-neutral-600 w-24 text-center">Назад</button>
            </div>
        </div>
    )
}