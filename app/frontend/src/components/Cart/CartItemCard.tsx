import { CartItem, IProduct } from "../../types/types"
import { Link } from "react-router-dom";
import { getImageUrl } from "../../helpers/image.helper";
import QuantityController from "../Common/QuantityController";

interface Props {
    cartItem: CartItem,
    product: IProduct,
    handleDeleteClick: (productId: number) => void,
    handleChangeQuantityClick: (productId: number, newQuantity: number) => void
}


export default function CartItemCard({ cartItem, product, handleDeleteClick, handleChangeQuantityClick }: Props) {
    return (
        <div id={`cart-item-${product.id}`} className="flex md:flex-row flex-col md:gap-4 gap-2 p-2 rounded-xl">
            <div className="flex flex-row gap-2">
                <Link to={`/catalog/${product.id}`} className="object-contain rounded-xl w-22 h-22 block">
                    <img loading="lazy" className="w-full h-full" src={getImageUrl(product.image)} alt={product.name}></img>
                </Link>
            </div>
            <div className="flex flex-col">
                <div className="font-bold ">{product.name}</div>
                <QuantityController
                    price={product.price}
                    quantity={cartItem.quantity}
                    onChange={(newQuantity) => handleChangeQuantityClick(product.id, newQuantity)}
                />
            </div>
            <button
                onClick={() => handleDeleteClick(product.id)}
                className="hover:bg-gray-100 active:bg-gray-200 brightness-95 hover:brightness-100 rounded-lg p-1 w-7 h-7 md:ml-auto transition-colors duration-150"
            >
                <img src="/trash-can.svg" draggable={false}></img>
            </button>
        </div>

    )
}
