import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../api/catalog/getProduct";
import { deleteProduct } from "../../api/catalog/deleteProduct";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useAuth";
import useCartStore from "../../store/user/cartStore";


export default function CatalogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const addToCart = useCartStore(state => state.add);
    const removeFromCart = useCartStore(state => state.remove);
    const cartList = useCartStore(state => state.list);


    const { isPending, isError, data, error, } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(parseInt(id!)),
    });


    if (isPending) {
        return <Loading></Loading>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const product = data.data;
    const cartItem = cartList.find(e => e.productId == product.id);

    const handleDelete = async () => {
        if (confirm('Удалить продукт?')) {
            try {
                await deleteProduct(product.id);
                navigate('/catalog');
            } catch (error) {
                console.error('Error occured while deleting the product: ', error);
            }
        }
    }

    const handleEdit = async () => {
        navigate('/catalog/edit/' + product.id);
    }

    return (
        <div className="max-w-[1440px] w-[90%] mx-auto my-4">
            <Link to='/catalog' className="flex items-center justify-center w-20 p-2 mb-4 text-white rounded-lg bg-amber-500 hover:bg-amber-600">
                <img src="/arrow-left.svg" className="w-8"></img>
            </Link>

            <div className="flex flex-col md:flex-row gap-x-8">

                <div className="flex-1/3">
                    <img className="border border-gray-200 rounded-xl " src={"data:image/png;base64," + product.image}></img>
                </div>
                <div className="mt-8 flex-1/3">
                    <div className="mb-4">
                        <p className="font-bold">{product.name}</p>

                    </div>
                    <div>
                        <table className="font-bold text-left">
                            <caption className="float-left mb-4 font-bold">Характеристики:</caption>
                            <tbody>
                                <tr>
                                    <th className="font-normal">Артикул</th>
                                    <td>{product.id}</td>
                                </tr>
                                <tr>
                                    <th className="font-normal">Вес</th>
                                    <td>{product.weight} кг</td>
                                </tr>
                                <tr>
                                    <th className="font-normal">Длина</th>
                                    <td>{product.size.x} м</td>
                                </tr>
                                <tr>
                                    <th className="font-normal">Ширина</th>
                                    <td>{product.size.y} м</td>
                                </tr>
                                <tr>
                                    <th className="font-normal">Высота</th>
                                    <td>{product.size.z} м</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-12">
                        <h3 className="font-bold">Описание:</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
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
                                    <button className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-amber-400 hover:bg-amber-500">Заказать</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}