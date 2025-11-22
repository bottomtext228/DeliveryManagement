interface Props {
    price: number,
    quantity: number
    onChange: (newQuantity: number) => void;
}


export default function QuantityController({ price, quantity, onChange }: Props) {
    return (
        <div className="flex justify-center items-center h-fit w-fit">
            <div className="mr-2">
                {price}₽
            </div>
            <div className="text-gray-500 mr-2">
                &times;
            </div>
            <div className="flex justify-center items-center gap-x-1">
                <button onClick={() => onChange(quantity - 1)} type="button"
                    className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 hover:bg-neutral-50 active:bg-neutral-100 border shadow">
                </button>
                <div className="text-gray-500">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="outline-neutral-200 w-8 text-center border-neutral-200 border rounded-md"
                        min={1}
                        max={99}
                    />
                </div>
                <button onClick={() => onChange(quantity + 1)} type="button"
                    className="mr-2 before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 after:w-4 after:h-1 after:bg-neutral-600 hover:after:bg-neutral-900 after:rotate-90 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 hover:bg-neutral-50 active:bg-neutral-100 border shadow">
                </button >
            </div>
            <div className="mr-2">
                =
            </div>
            <div className="mr-2">
                {price * quantity}₽
            </div>
        </div>
    )
}
