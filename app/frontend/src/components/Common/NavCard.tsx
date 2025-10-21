import { Link } from "react-router-dom"

interface Props {
    link: string,
    image: string,
    label: string
}

export const NavCard = ({ link, image, label }: Props) => {
    return (
        <Link to={link} className="flex flex-col h-40 transition-transform transform border border-gray-200 rounded-2xl active:scale-98 group">
            <img className="w-20 h-20 m-4 mx-auto" src={image} draggable={false}></img>
            <div className="m-4 mx-auto mt-auto text-2xl font-semibold group-hover:text-amber-400 group-active:text-amber-500">{label}</div>
        </Link>
    )
}