import { Link } from "react-router-dom";

interface Props {
    label: string,
    link: string,
    onClick: () => void;
}

export default function DropdownRow({ label, link, onClick }: Props) {
    return (
        <Link
            onClick={onClick}
            to={link}
            className="px-4 py-1 my-1 opacity-85 hover:bg-neutral-200 active:bg-neutral-300">
            {label}
        </Link>
    )
}