import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../api/catalog/getProduct";
import { deleteProduct } from "../../api/catalog/deleteProduct";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useAuth";


export default function CatalogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    if (isNaN(parseInt(id!))) {
        return <span>Not found...</span>
    }
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
        <div className="flex lg:w-5xl md:w-4xl sm:w-2xl w-36 mx-auto my-16">
            <div className="flex-1/3 mr-8">
                <img className="rounded-xl" src={"data:image/png;base64," + product.image}></img>

            </div>
            <div className="mt-8 flex-1/3">
                <div className="mb-4">
                    <p className="font-bold">{product.name}</p>

                </div>
                <div>
                    <table>
                        <caption className="float-left mb-4 font-bold">Характеристики:</caption>
                        <tbody>
                            <tr>
                                <td>Артикул</td>
                                <th>{product.id}</th>
                            </tr>
                            <tr>
                                <td>Вес</td>
                                <th>{product.weight} кг</th>
                            </tr>
                            <tr>
                                <td>Длина</td>
                                <th>{product.size.x} м</th>
                            </tr>
                            <tr>
                                <td>Ширина</td>
                                <th>{product.size.y} м</th>
                            </tr>
                            <tr>
                                <td>Высота</td>
                                <th>{product.size.z} м</th>
                            </tr>
                            <tr>
                                <td></td>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-12">
                    <h3 className="font-bold">Описание:</h3>
                    <p>{product.description}</p>
                </div>
            </div>
            <div className="flex-1/3 mt-6">
                <div className="w-full h-48 border-2 border-amber-500 rounded-2xl flex flex-col">
                    <div className="font-semibold p-6">{product.price} ₽</div>
                    <div className="mt-auto mb-2 mx-auto w-[75%] flex flex-col gap-2">
                        {user?.roles.includes('company') ?
                            <>
                                <button onClick={handleEdit} className="w-full block shadow-neutral-500 shadow-sm p-1 rounded-xl text-center font-semibold bg-neutral-50 hover:bg-neutral-200">Редактировать</button>
                                <button onClick={handleDelete} className="w-full block shadow-neutral-500 shadow-sm p-1 rounded-xl text-center font-semibold bg-red-600 hover:bg-red-700">Удалить</button>
                            </>
                            : <>
                                <button className="w-full block shadow-neutral-500 shadow-sm p-1 rounded-xl text-center font-semibold bg-neutral-50 hover:bg-neutral-200">В корзину</button>
                                <button className="w-full block shadow-neutral-500 shadow-sm p-1 rounded-xl text-center font-semibold bg-amber-400 hover:bg-amber-500">Заказать</button>
                            </>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}