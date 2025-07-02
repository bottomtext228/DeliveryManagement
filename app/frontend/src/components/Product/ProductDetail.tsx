import { IProductDetail } from "../../types/types";

interface Props {
    product: IProductDetail
}

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export default function ProductDetail({ product }: Props) {
    return (
        <>
            <div className="flex-1/3">
                <img className="border border-gray-200 rounded-xl " src={`${imageBaseUrl}${product.image}`}></img>
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
        </>
    )
}