import CartItemCard from "../components/Cart/CartItemCard";
import useCartStore from "../store/user/cartStore";

export default function Cart() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);


    return (
        <section className="my-4 md:my-16">

            <div className="max-w-[1440px] w-[90%] mx-auto">
                <div className="flex h-8 gap-8 items-end mb-8">
                    <h1 className="font-bold text-2xl">Корзина</h1>
                    <div className="">Всего: {cartList.length}</div>
                </div>
                {cartList.length ?
                    <div className="flex flex-col gap-8">

                        {cartList.map(item => (
                            <CartItemCard cartItem={item} handleDeleteClick={(productId) => removeFromCart(productId)}></CartItemCard>
                        ))}
                    </div>


                    : <>
                    </>}
            </div>
        </section>
    )
}
