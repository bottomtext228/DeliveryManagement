import { Link } from "react-router-dom";
import useCartStore from "../../store/user/cartStore";

interface Props {
  productId: number
}

export default function CartSection({ productId }: Props) {
  const addToCart = useCartStore(store => store.add);
  const cartList = useCartStore(store => store.list);
  const cartItem = cartList.find(e => e.productId == productId);

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
          onClick={() => addToCart(productId)}
          className="flex items-center justify-center w-full p-2 rounded-xl font-semibold text-white hover:text-neutral-100 active:text-neutral-200 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 active:scale-98"
        >
          В корзину
        </button>
      }
    </>


  )
}
