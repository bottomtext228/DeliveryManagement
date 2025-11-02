import { useNavigate } from 'react-router-dom'
import Button from './Button';

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
            <div className="flex gap-8 p-2 font-semibold text-lg text-center">
                {link &&
                    <Button label={linkMessage!} link={link} rounded="lg" width="24" />
                }
                <Button label="Назад" onClick={() => navigate(-1)} dark={true} rounded="lg" width="24" />
            </div>
        </div>
    )
}
