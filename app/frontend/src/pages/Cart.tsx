import Loading from "../components/Loading/Loading";
import { IProductDetail } from "../types/types";
import CartCompanyCard from "../components/Cart/CartCompanyCard";
import EmptyStateCard from "../components/Common/EmptyStateCard";
import { useProductsDetail } from "../hooks/queries/useProductsDetail";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../hooks/queries/useCart";
import { useSetCartItem } from "../hooks/mutations/useSetCartItem";
import ErrorPage from "../components/Error/ErrorPage";

export default function Cart() {
    const location = useLocation();
    const scrollToId = location.state?.scrollTo;

    // watch dom until the cart item is rendered to scroll to it
    useEffect(() => {
        if (!scrollToId) return;

        const tryScroll = () => {
            const el = document.getElementById(scrollToId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                observer.disconnect();
            }
        };

        const observer = new MutationObserver(tryScroll);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [scrollToId]);


    const cartQuery = useCart();
    const setCartItem = useSetCartItem();

    const cartList = cartQuery.data?.cartItems || [];

    const productQueries = useProductsDetail(cartList.map(item => item.productId));

    const isPending = productQueries.some(e => e.isPending) || cartQuery.isPending;

    useEffect(() => {
        cartQuery.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isPending) return <Loading></Loading>

    if (cartQuery.isError) return <ErrorPage error={cartQuery.error} />
    
    const products = productQueries.map(e => e.data).filter((product): product is IProductDetail => !!product);

    function handleDeleteClick(productId: number) {
        setCartItem.mutate({ productId: productId, quantity: 0 });
    }

    function handleIncreaseQuantityClick(productId: number) {
        const cartItem = cartList.find(e => e.productId == productId);
        if (cartItem && cartItem.quantity < 99) setCartItem.mutate({ productId: productId, quantity: cartItem.quantity + 1 });
    }

    function handleDecreaseQuantityClick(productId: number) {
        const cartItem = cartList.find(e => e.productId == productId);
        if (cartItem && cartItem.quantity > 1) setCartItem.mutate({ productId: productId, quantity: cartItem.quantity - 1 });
    }

    function getProductsCount() {
        return cartList.reduce((acc, item) => acc + item.quantity, 0)
    }

    const groupedByCompanies = Object.groupBy(products, ({ companyId }) => companyId);

    return (
        <section className="my-4 md:my-16">

            <div className="max-w-[1440px] w-[90%] mx-auto">
                <div className="flex h-8 gap-8 items-end mb-8">
                    <h1 className="font-bold text-2xl">Корзина</h1>
                    <div>Всего: {getProductsCount()}</div>
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
