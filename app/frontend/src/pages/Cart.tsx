import useCartStore from "../store/user/cartStore";
import Loading from "../components/Loading/Loading";
import { IProductDetail } from "../types/types";
import CartCompanyCard from "../components/Cart/CartCompanyCard";
import EmptyStateCard from "../components/Common/EmptyStateCard";
import { useProductsDetail } from "../hooks/queries/useProductsDetail";
import ErrorPage from "../components/Error/ErrorPage";

export default function Cart() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);
    const getProductsCount = useCartStore(store => store.getProductsCount);

    const productQueries = useProductsDetail(cartList.map(item => item.productId));

    const isPending = productQueries.some(e => e.isPending);
    const isError = productQueries.some(e => e.isError);

    if (isPending) return <Loading></Loading>

    if (isError) {
        const error = productQueries.find(e => e.error)?.error;
        return <ErrorPage message={error?.message} />;
    }

    const products = productQueries.map(e => e.data).filter((product): product is IProductDetail => !!product);

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

    const groupedByCompanies = Object.groupBy(products, ({ companyId }) => companyId);

    return (
        <section className="my-4 md:my-16">

            <div className="max-w-[1440px] w-[90%] mx-auto">
                <div className="flex h-8 gap-8 items-end mb-8">
                    <h1 className="font-bold text-2xl">Корзина</h1>
                    <div className="">Всего: {getProductsCount()}</div>
                </div>
                {
                    cartList.length ? (
                        <div className="flex flex-col gap-8">
                            {Object.entries(groupedByCompanies).map(([companyId, products]) => (
                                <CartCompanyCard
                                    key={companyId}
                                    companyId={Number(companyId)}
                                    products={products!}
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
