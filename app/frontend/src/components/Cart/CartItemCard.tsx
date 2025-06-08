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
        <div className="flex md:flex-row flex-col md:gap-4 gap-2 p-2 border rounded-xl border-neutral-200">
            <div className="flex flex-row gap-2">
                <Link to={`/catalog/${product.id}`} className="object-contain w-22 h-22 block">
                    <img loading="lazy" className="w-full h-full" src={product.image} alt={product.name}></img>
                </Link>
                <div className="font-bold ">{product.name}</div>
            </div>
            <div className="flex justify-center items-center gap-x-3 h-fit w-fit">
                <button onClick={() => handleDecreaseQuantityClick(product.id)}
                    className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow duration-3000 transition-all">
                </button>
                <div>
                    {cartItem.quantity}
                </div>
                <button onClick={() => handleIncreaseQuantityClick(product.id)}
                    className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 after:w-4 after:h-1 after:bg-neutral-600 hover:after:bg-neutral-900 after:rotate-90 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow">
                </button>
            </div>
            <div>
                {product.price * cartItem.quantity}₽
            </div>

            <button className="hover:bg-gray-100 brightness-95 hover:brightness-100 rounded-lg p-1 w-7 h-7 md:ml-auto transition-colors duration-150" onClick={() => handleDeleteClick(product.id)}>
                <img src="./trash-can.svg"></img>
            </button>

        </div>

    )
}
