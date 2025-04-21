import { useQuery } from "@tanstack/react-query"
import { getProductDetail } from "../../api/catalog/getProduct"
import { CartItem } from "../../types/types"
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Link } from "react-router-dom";

interface Props {
    cartItem: CartItem,
    handleDeleteClick: (productId: number) => void
}


export default function CartItemCard({ cartItem, handleDeleteClick }: Props) {
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['product', cartItem.productId],
        queryFn: () => getProductDetail(cartItem.productId),
        refetchOnWindowFocus: false
    });

    if (isPending) return <LoadingSpinner></LoadingSpinner>
    if (isError) return <span>Error: {error.message}</span>

    const product = data.data;
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
            
            <button>
                
                +
            </button>
            <button>
                -
            </button>
            <button className="ml-auto w-8 h-8" onClick={() => handleDeleteClick(product.id)}>
                <img src="./trash-can.svg"></img>
            </button>
            
        </div>
    )
}
