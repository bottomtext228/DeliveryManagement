import { createOrder } from "../api/orders/createOrder";
import CartItemCard from "../components/Cart/CartItemCard";
import useCartStore from "../store/user/cartStore";
import { CreateOrderDto } from "../types/types";

export default function Cart() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);

    function handleDeleteClick(productId: number) {
        removeFromCart(productId);
    }

    function handleIncreaseQuantityClick(productId: number) {
        const cartItem = cartList.find(e => e.productId == productId);
        if (cartItem && cartItem.quantity < 10) addToCart(productId);
    }

    function handleDecreaseQuantityClick(productId: number) {
        const cartItem = cartList.find(e => e.productId == productId);
        if (cartItem && cartItem.quantity > 1) removeFromCart(productId, true);
    }

    function handleOrderClick() {
        /*     cartList.map(item => {
                createOrder({ productId: item.productId, quantity: item.quantity, pickUpPointTownId: 1} as CreateOrderDto)
            }) */
    }

    const calculateProductsCount = () => {
        let count = 0;
        for (let i = 0; i < cartList.length; i++) {
            count += cartList[i].quantity;
        }
        return count;
    }

    return (
        <section className="my-4 md:my-16">

            <div className="max-w-[1440px] w-[90%] mx-auto">
                <div className="flex h-8 gap-8 items-end mb-8">
                    <h1 className="font-bold text-2xl">Корзина</h1>
                    <div className="">Всего: {calculateProductsCount()}</div>
                </div>
                {cartList.length ?
                    <>
                        <div className="flex flex-col gap-8">
                            {cartList.map(item => (
                                <CartItemCard
                                    cartItem={item}
                                    handleDeleteClick={handleDeleteClick}
                                    handleIncreaseQuantityClick={handleIncreaseQuantityClick}
                                    handleDecreaseQuantityClick={handleDecreaseQuantityClick}
                                >
                                </CartItemCard>
                            ))}
                        </div>
                        <div className="my-8">
                            <button onClick={handleOrderClick} className="mr-auto bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700">Заказать всё</button>
                        </div>

                    </>
                    : <>
                    </>}
            </div>
        </section>
    )
}
