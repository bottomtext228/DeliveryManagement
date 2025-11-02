import Button from "./Button"

interface Props {
    message: string
}

export default function EmptyStateCard({ message }: Props) {
    return (
        <div className="flex flex-col items-center w-full gap-y-2">
            <h2 className="text-4xl font-semibold">Здесь пока пусто...</h2>
            <div>{message}</div>
            <div className="font-semibold mt-4">
                <Button label="Перейти в каталог" link="/catalog" />
            </div>
        </div>
    )
}
