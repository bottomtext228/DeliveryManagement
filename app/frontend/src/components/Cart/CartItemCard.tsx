import { useQuery } from "@tanstack/react-query"
import { getProductDetail } from "../../api/catalog/getProduct"
import { CartItem, IProduct } from "../../types/types"
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Link } from "react-router-dom";

interface Props {
    cartItem: CartItem,
    product: IProduct,
    handleDeleteClick: (productId: number) => void,
    handleIncreaseQuantityClick: (productId: number) => void,
    handleDecreaseQuantityClick: (productId: number) => void,
}


export default function CartItemCard({ cartItem, product, handleDeleteClick, handleIncreaseQuantityClick, handleDecreaseQuantityClick }: Props) {
    /*     const { isPending, isError, error, data } = useQuery({
            queryKey: ['product', cartItem.productId],
            queryFn: () => getProductDetail(cartItem.productId),
            refetchOnWindowFocus: false
        }); */

    /*  if (isPending) return <LoadingSpinner></LoadingSpinner>
     if (isError) return <span>Error: {error.message}</span> */
    /* 
        const product = data.data; */
    return (
        <div className="flex gap-4">
            <Link to={`/catalog/${product.id}`} className="w-22 h-22 object-contain"><img loading="lazy" className="w-full h-full" src={product.image} alt={product.name}></img></Link>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <div>
                &times;{cartItem.quantity}
            </div>
            <div>
                = {product.price * cartItem.quantity}₽
            </div>

            <button onClick={() => handleIncreaseQuantityClick(product.id)} className="w-2 h-2 bg-gray-200">
                +
            </button>
            <button onClick={() => handleDecreaseQuantityClick(product.id)}>
                -
            </button>
            <button className="ml-auto w-8 h-8" onClick={() => handleDeleteClick(product.id)}>
                <img src="./trash-can.svg"></img>
            </button>

        </div>
    )
}
