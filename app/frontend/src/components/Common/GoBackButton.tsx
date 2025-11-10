import { Link, useNavigate } from "react-router-dom"

interface Props {
    link?: string;
}

export default function GoBackButton({ link }: Props) {
    const navigate = useNavigate();

    const className = "flex items-center justify-center w-20 h-12 p-2 mb-4 rounded-lg bg-amber-400 hover:bg-amber-500 active:bg-amber-600";

    const content = <img src="/arrow-left.svg" className="w-8" draggable={false}></img>
    return link ?
        <Link
            className={className}
            to={link}
        >
            {content}
        </Link> :
        <button
            onClick={() => navigate(-1)}
            className={className}
        >
            <img src="/arrow-left.svg" className="w-8" draggable={false}></img>
        </button>
}
