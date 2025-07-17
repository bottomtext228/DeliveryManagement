import { useQueries } from "@tanstack/react-query";
import useCartStore from "../store/user/cartStore";
import Loading from "../components/Loading/Loading";
import { groupBy } from "../helpers/polyfill.helper";
import { IProduct } from "../types/types";
import CartCompanyCard from "../components/Cart/CartCompanyCard";
import { productDetailQueryOptions } from "../queries/productDetail.query";
import EmptyStateCard from "../components/Common/EmptyStateCard";

export default function Cart() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);


    const result = useQueries({
        queries: cartList.map((item) => (productDetailQueryOptions(item.productId))),
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
                {
                    cartList.length ? (
                        <div className="flex flex-col gap-8">
                            {Object.entries(groupedByCompanies).map(([companyId, products]) => (
                                <CartCompanyCard
                                    key={companyId}
                                    companyId={Number(companyId)}
                                    products={products}
                                    cartList={cartList}
                                    handleDeleteClick={handleDeleteClick}
                                    handleIncreaseQuantityClick={handleIncreaseQuantityClick}
                                    handleDecreaseQuantityClick={handleDecreaseQuantityClick}
                                ></CartCompanyCard>
                            ))}
                        </div>
                    ) : (
                        <EmptyStateCard message="Вы можете добавить желаемые товары в корзину и они будут отображаться здесь." />
                    )
                }
            </div>
        </section>
    )
}
