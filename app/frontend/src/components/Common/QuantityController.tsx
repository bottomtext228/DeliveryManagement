interface Props {
    price: number,
    quantity: number
    onDecrease: () => void;
    onIncrease: () => void;
}


export default function QuantityController({ price, quantity, onDecrease, onIncrease }: Props) {
    return (
        <div className="flex justify-center items-center gap-x-2 h-fit w-fit">
            <div>
                {price}₽
            </div>
            <div className="text-gray-500">
                &times;
            </div>
            <button onClick={onDecrease} type="button"
                className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 hover:bg-neutral-50 active:bg-neutral-100 border shadow">
            </button>
            <div className="text-gray-500">
                {quantity}
            </div>
            <button onClick={onIncrease} type="button"
                className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 after:w-4 after:h-1 after:bg-neutral-600 hover:after:bg-neutral-900 after:rotate-90 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 hover:bg-neutral-50 active:bg-neutral-100 border shadow">
            </button>
            <div>
                =
            </div>
            <div>
                {price * quantity}₽
            </div>
        </div>
    )
}
