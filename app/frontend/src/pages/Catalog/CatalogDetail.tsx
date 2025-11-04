import { Link, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import ProductDetail from "../../components/Product/ProductDetail";
import { useNumericParam } from "../../hooks/useNumericParam";
import { isAxiosError } from "axios";
import ErrorPage from "../../components/Error/ErrorPage";
import NotFound from "../../components/NotFound/NotFound";
import { useState } from "react";
import ServerError from "../../components/Error/ServerError";
import GoBackButton from "../../components/Common/GoBackButton";
import { useProductDetail } from "../../hooks/queries/useProductDetail";
import { useDeleteProduct } from "../../hooks/mutations/useDeleteProduct";
import { useCart } from "../../hooks/queries/useCart";
import { useSetCartItem } from "../../hooks/mutations/useSetCartItem";

export default function CatalogDetail() {
    const id = useNumericParam();
    const navigate = useNavigate();
    const user = useUser();

    const setCartItem = useSetCartItem();
    const cartQuery = useCart();

    const [serverError, setServerError] = useState<unknown>(null);

    const deleteProduct = useDeleteProduct();

    const productQuery = useProductDetail(id);

    if (id === null) {
        return <NotFound />
    }

    if (productQuery.isPending || cartQuery.isPending) {
        return <Loading />
    }

    if (productQuery.isError || cartQuery.isError) {
        const error = productQuery.error || cartQuery.error;
        if (isAxiosError(error)) {
            if (error.response?.status === 404) return <NotFound />
        }
        return <ErrorPage message={error!.message} />
    }

    const product = productQuery.data;

    const cartItem = cartQuery.data.cartItems.find(e => e.productId == product.id);

    const handleDelete = async () => {
        if (confirm('Удалить продукт?')) {
            deleteProduct.mutate(id, {
                onSuccess: () => {
                    navigate('/catalog');
                },
                onError: (error) => {
                    setServerError(error);
                }
            });
        }
    }

    const handleEdit = async () => {
        navigate('/catalog/edit/' + product.id);
    }

    const handleCartClick = () => {
        setCartItem.mutate({ productId: product.id, quantity: cartItem ? 0 : 1 });
    }


    return (
        <div className="max-w-[1440px] w-[90%] mx-auto my-4">
            <GoBackButton />
            {serverError !== null && <ServerError error={serverError} />}
            <div className="flex flex-col md:flex-row gap-x-8">
                <ProductDetail product={product}></ProductDetail>
                <div className="mt-6 flex-1/3">
                    <div className="flex flex-col h-48 border-2 max-w-72 border-amber-500 rounded-2xl">
                        <div className="p-4 font-semibold">{product.price} ₽</div>
                        <div className="mt-auto p-4 mx-auto w-full flex flex-col gap-2">
                            {user?.roles.includes('company') ?
                                <>
                                    <button
                                        onClick={handleEdit}
                                        className="block w-full p-2 font-semibold text-center rounded-xl active:scale-98 border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="block w-full p-2 font-semibold text-center rounded-xl active:scale-98 text-white bg-red-600 shadow-neutral-500 hover:bg-red-700"
                                    >
                                        Удалить
                                    </button>
                                </>
                                : <>
                                    <button
                                        onClick={handleCartClick}
                                        className={`block w-full p-2 font-semibold text-center rounded-xl active:scale-98 ${cartItem ? "border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300" : "text-white bg-neutral-400 hover:bg-neutral-500 active:bg-neutral-600"}`}
                                    >
                                        {cartItem ? "Убрать из корзины" : "В корзину"}
                                    </button>
                                    <Link
                                        to={`/orders/add?ids=${product.id}`}
                                        className="block w-full p-2 font-semibold text-center rounded-xl text-white hover:text-neutral-100 active:text-neutral-200 active:scale-98 bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
                                    >
                                        Заказать
                                    </Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}