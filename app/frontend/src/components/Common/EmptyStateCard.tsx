import { Link } from "react-router-dom"

interface Props {
    message: string
}

export default function EmptyStateCard({ message }: Props) {
    return (
        <div className="flex flex-col items-center w-full gap-y-2">
            <h2 className="text-4xl font-semibold">Здесь пока пусто...</h2>
            <div>{message}</div>
            <Link to='/catalog' className="bg-amber-500  p-2 rounded-lg text-white font-semibold text-lg hover:bg-amber-600 text-center">Перейти в каталог</Link>
        </div>
    )
}
