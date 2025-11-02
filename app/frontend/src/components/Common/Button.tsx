import { Link } from "react-router-dom";

interface Props {
    label: string,
    link?: string,
    rounded?: 'lg' | 'xl',
    fontWeight?: 'normal' | 'bold' | 'semibold',
    fontSize?: 'sm' | 'base' | 'lg' | 'xl'
    dark?: boolean,
    onClick?: () => void;
    width?: string;
}

export default function Button({ label, link, rounded = 'xl', fontWeight = 'normal', fontSize = 'base', dark = false, onClick, width = 'full' }: Props) {
    const className = `p-2 text-xl w-${width} font-${fontWeight} text-${fontSize} text-white hover:text-neutral-100 active:text-neutral-200 rounded-${rounded} ${dark
        ? "bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700"
        : "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
        }`;

    if (link) {
        return (<Link onClick={onClick} to={link} className={className}>{label}</Link>)
    }

    return (<button onClick={onClick} className={className}>{label}</button>)
}
