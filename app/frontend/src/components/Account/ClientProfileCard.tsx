import { ClientProfileDto } from "../../types/types"

interface Props {
    data: ClientProfileDto
}

export default function ClientProfileCard({ data }: Props) {

    return (
        <table className="font-bold text-left w-full">
            <caption className="float-left mb-1 font-bold text-lg">Статистика</caption>
            <tbody className="divide-y divide-gray-200">
                <tr>
                    <th className="font-normal p-2">Заказы</th>
                    <td className="text-lg text-right p-2">{data.ordersCount}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Стоимость заказов</th>
                    <td className="text-lg text-right p-2">{data.ordersCost}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Корзина</th>
                    <td className="text-lg text-right p-2">{data.productsInCartCount}</td>
                </tr>
            </tbody>
        </table>
    )
}
