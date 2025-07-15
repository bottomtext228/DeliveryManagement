import { Link, useNavigate } from 'react-router-dom'

interface Props {
    title: string,
    message?: string,
    link?: string;
    linkMessage?: string;
}

export default function WarningCard({ title, message, link, linkMessage }: Props) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-8 items-center justify-center my-4 md:my-16 border border-gray-300 p-4 max-w-fit w-[90%] mx-auto rounded-xl shadow-xl">
            <h2 className="font-semibold text-lg">
                {title}
            </h2>
            {message &&
                <div>
                    {message}
                </div>
            }
            <div className="flex gap-8">
                {link &&
                    <Link to={link} className="bg-amber-500  p-2 rounded-lg text-white font-semibold text-lg  hover:bg-amber-600 w-24 text-center">
                        {linkMessage}
                    </Link>
                }
                <button onClick={() => navigate(-1)} className="bg-neutral-500 p-2 rounded-lg text-white font-semibold text-lg hover:bg-neutral-600 w-24 text-center">Назад</button>
            </div>
        </div>
    )
}
