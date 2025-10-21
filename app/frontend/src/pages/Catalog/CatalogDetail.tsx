import { Link, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import useCartStore from "../../store/user/cartStore";
import ProductDetail from "../../components/Product/ProductDetail";
import { useNumericParam } from "../../hooks/useNumericParam";
import { isAxiosError } from "axios";
import ErrorPage from "../../components/Error/ErrorPage";
import NotFound from "../../components/NotFound/NotFound";
import { useEffect, useState } from "react";
import ServerError from "../../components/Error/ServerError";
import GoBackButton from "../../components/Common/GoBackButton";
import { useProductDetail } from "../../hooks/queries/useProductDetail";
import { useDeleteProduct } from "../../hooks/mutations/useDeleteProduct";


export default function CatalogDetail() {
    const id = useNumericParam();
    const navigate = useNavigate();
    const user = useUser();
    const addToCart = useCartStore(state => state.add);
    const removeFromCart = useCartStore(state => state.remove);
    const cartList = useCartStore(state => state.list);
    const [serverError, setServerError] = useState<unknown>(null);

    const deleteProduct = useDeleteProduct();

    const { isPending, isError, data, error } = useProductDetail(id);
    useEffect(() => {
        addToCart(255);
        addToCart(444);
        addToCart(111);
    }, []);
    if (id === null) {
        return <NotFound />
    }

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        if (isAxiosError(error)) {
            if (error.response?.status === 404) return <NotFound />
        }
        return <ErrorPage message={error.message} />
    }

    const product = data;
    
    const cartItem = cartList.find(e => e.productId == product.id);

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

    return (
        <div className="max-w-[1440px] w-[90%] mx-auto my-4">
            <GoBackButton />
            {serverError !== null && <ServerError error={serverError} />}
            <div className="flex flex-col md:flex-row gap-x-8">
                <ProductDetail product={product}></ProductDetail>
                <div className="mt-6 flex-1/3">
                    <div className="flex flex-col h-48 border-2 max-w-72 border-amber-500 rounded-2xl">
                        <div className="p-6 font-semibold">{product.price} ₽</div>
                        <div className="mt-auto mb-2 mx-auto w-[75%] flex flex-col gap-2">
                            {user?.roles.includes('company') ?
                                <>
                                    <button onClick={handleEdit} className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-neutral-50 hover:bg-neutral-200">Редактировать</button>
                                    <button onClick={handleDelete} className="block w-full p-1 font-semibold text-center bg-red-600 shadow-sm shadow-neutral-500 rounded-xl hover:bg-red-700">Удалить</button>
                                </>
                                : <>
                                    <button onClick={() => cartItem ? removeFromCart(product.id) : addToCart(product.id)} className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-neutral-50 hover:bg-neutral-200">
                                        {cartItem ? "Убрать из корзины" : "В корзину"}
                                    </button>
                                    <Link to={`/orders/add?ids=${product.id}`} className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-amber-400 hover:bg-amber-500">Заказать</Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}