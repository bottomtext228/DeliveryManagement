import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col gap-8 items-center justify-center my-4 md:my-16 border border-gray-300 p-4 max-w-64 w-[90%] mx-auto rounded-xl shadow-xl">
                <div className="font-semibold text-lg">
                    Ничего не найденo...
                </div>
                <div className="flex gap-8">
                    <Link to='/' className="bg-amber-500  p-2 rounded-lg text-white font-semibold text-lg  hover:bg-amber-600 w-24 text-center">Главная</Link>
                    <button onClick={() => navigate(-1)} className="bg-neutral-500 p-2 rounded-lg text-white font-semibold text-lg hover:bg-neutral-600 w-24 text-center">Назад</button>
                </div>
            </div>
        </>
    )
}