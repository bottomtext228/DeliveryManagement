import { NavLink } from "react-router-dom";

interface Props {
    label: string;
    link: string;
    onClick: () => void;
}

export default function NavLinkItem({ label, link, onClick }: Props) {
    return (
        <li className="p-2">
            <NavLink
                to={link}
                className={({ isActive }) => isActive ? 'border-b border-b-amber-400 text-orange-400' : 'hover:text-orange-400 active:text-orange-500'}
                onClick={onClick}>
                {label}
            </NavLink>
        </li>
    )
}