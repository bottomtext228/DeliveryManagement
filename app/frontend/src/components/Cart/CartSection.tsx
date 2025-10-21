import useCartStore from "../../store/user/cartStore";

interface Props {
  productId: number
}

export default function CartSection({ productId }: Props) {
  const addToCart = useCartStore(store => store.add);
  const removeFromCart = useCartStore(store => store.remove);
  const cartList = useCartStore(store => store.list);
  const cartItem = cartList.find(e => e.productId == productId);


  return (

    <>
      {cartItem ?
        <button onClick={() => removeFromCart(productId)} className="flex items-center justify-center w-full p-2 font-semibold text-black rounded-xl bg-neutral-400 hover:bg-neutral-500">
          В корзине
        </button>
        :
        <button onClick={() => addToCart(productId)} 
        className="flex items-center justify-center w-full p-2 font-semibold text-white hover:text-neutral-100 active:text-neutral-200 rounded-xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 active:scale-98">
          В корзину
        </button>
      }
    </>


  )
}
