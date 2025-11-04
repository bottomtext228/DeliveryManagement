import { Link } from "react-router-dom";
import { useSetCartItem } from "../../hooks/mutations/useSetCartItem";
import { CartItem } from "../../types/types";

interface Props {
    productId: number
    cartItem?: CartItem
}

export default function CartSection({ productId, cartItem }: Props) {   
    const setCartItem = useSetCartItem();

    function handleAdd() {
        setCartItem.mutate({ productId: productId, quantity: cartItem?.quantity ?? 1 });
    }

    return (
        <>
            {cartItem ?
                <Link
                    to="/cart"
                    state={{
                        scrollTo: `cart-item-${cartItem.productId}`
                    }}
                    className="flex items-center justify-center w-full p-2 rounded-xl font-semibold text-white bg-neutral-400 hover:bg-neutral-500 active:bg-neutral-600 active:scale-98"
                >
                    В корзине
                </Link>
                :
                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center w-full p-2 rounded-xl font-semibold text-white hover:text-neutral-100 active:text-neutral-200 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 active:scale-98"
                >
                    В корзину
                </button>
            }
        </>
    )
}
