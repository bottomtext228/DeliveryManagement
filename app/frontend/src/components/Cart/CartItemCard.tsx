import { CartItem, IProduct } from "../../types/types"
import { Link } from "react-router-dom";
import { getImageUrl } from "../../helpers/image.helper";

interface Props {
    cartItem: CartItem,
    product: IProduct,
    handleDeleteClick: (productId: number) => void,
    handleIncreaseQuantityClick: (productId: number) => void,
    handleDecreaseQuantityClick: (productId: number) => void,
}


export default function CartItemCard({ cartItem, product, handleDeleteClick, handleIncreaseQuantityClick, handleDecreaseQuantityClick }: Props) {
    return (
        <div className="flex md:flex-row flex-col md:gap-4 gap-2 p-2 rounded-xl"> 
            <div className="flex flex-row gap-2">
                <Link to={`/catalog/${product.id}`} className="object-contain rounded-xl w-22 h-22 block">
                    <img loading="lazy" className="w-full h-full" src={getImageUrl(product.image)} alt={product.name}></img>
                </Link>
            </div>
            <div className="flex flex-col">
                <div className="font-bold ">{product.name}</div>
                <div className="flex justify-center items-center gap-x-2 h-fit w-fit">
                    <div>
                        {product.price}₽
                    </div>
                    <div className="text-gray-500">
                        &times;
                    </div>
                    <button onClick={() => handleDecreaseQuantityClick(product.id)}
                        className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow duration-3000 transition-all">
                    </button>
                    <div className="text-gray-500">
                        {cartItem.quantity}
                    </div>
                    <button onClick={() => handleIncreaseQuantityClick(product.id)}
                        className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 after:w-4 after:h-1 after:bg-neutral-600 hover:after:bg-neutral-900 after:rotate-90 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow">
                    </button>
                    <div>
                        =
                    </div>
                    <div>
                        {product.price * cartItem.quantity}₽
                    </div>
                </div>
            </div>

            <button className="hover:bg-gray-100 brightness-95 hover:brightness-100 rounded-lg p-1 w-7 h-7 md:ml-auto transition-colors duration-150" onClick={() => handleDeleteClick(product.id)}>
                <img src="./trash-can.svg"></img>
            </button>

        </div>

    )
}
