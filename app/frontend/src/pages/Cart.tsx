import { useQueries } from "@tanstack/react-query";
import CartItemCard from "../components/Cart/CartItemCard";
import useCartStore from "../store/user/cartStore";
import { getProductDetail } from "../api/catalog/getProduct";
import Loading from "../components/Loading/Loading";
import { groupBy } from "../helpers/polyfill.helper";
import { IProduct } from "../types/types";
import CartCompanyCard from "../components/Cart/CartCompanyCard";

export default function Cart() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);


    const result = useQueries({
        queries: cartList.map((item) => ({
            queryKey: ['product', item.productId],
            queryFn: () => getProductDetail(item.productId)
        })),
        combine: (results) => {
            return {
                isPending: results.some((r) => r.isPending),
                isError: results.some((r) => r.isError),
                data: results.map((r) => r.data),
                error: results.map((r) => r.error).filter(Boolean)
            };
        },
    });

    const { isPending, isError, error, data } = result;

    if (isPending) return <Loading></Loading>

    if (isError) {
        console.log(error);
        return <span>Error</span>
    }

    const products = data.map(e => e?.data).filter(Boolean);

    const getProductById = (id: number) => products.find(e => e?.id == id);

    function handleDeleteClick(productId: number) {
        removeFromCart(productId);
    }

    function handleIncreaseQuantityClick(productId: number) {
        const cartItem = cartList.find(e => e.productId == productId);
        if (cartItem && cartItem.quantity < 100) addToCart(productId);
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


    const groupedByCompanies: IProduct[][] = groupBy(products, ({ companyId }) => [companyId]);

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
                            {Object.entries(groupedByCompanies).map(([companyId, products]) =>
                                <CartCompanyCard
                                    key={companyId}
                                    companyId={Number(companyId)}
                                    products={products}
                                    cartList={cartList}
                                    handleDeleteClick={handleDeleteClick}
                                    handleIncreaseQuantityClick={handleIncreaseQuantityClick}
                                    handleDecreaseQuantityClick={handleDecreaseQuantityClick}

                                ></CartCompanyCard>
                            )}
                        </div>
                        <div className="my-8">
                            <button onClick={handleOrderClick} className="mr-auto bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700 transition-colors duration-150">Заказать всё</button>
                        </div>
                    </>
                    : <>
                    </>}
            </div>
        </section>
    )
}
