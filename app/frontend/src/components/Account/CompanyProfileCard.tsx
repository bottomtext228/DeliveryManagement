import { CompanyProfileDto } from "../../types/types"

interface Props {
    data: CompanyProfileDto
}

export default function CompanyProfileCard({ data }: Props) {
    return (
        <table className="font-bold text-left w-full">
            <caption className="float-left mb-1 font-bold text-lg">Статистика</caption>
            <tbody className="divide-y divide-gray-200">
                <tr>
                    <th className="font-normal p-2">Товары в каталоге</th>
                    <td className="text-lg text-right p-2">{data.productsCount}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Заказы</th>
                    <td className="text-lg text-right p-2">{data.ordersCount}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Товары в заказах</th>
                    <td className="text-lg text-right p-2">{data.orderedProductsCount}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Пункты выдачи заказов</th>
                    <td className="text-lg text-right p-2">{data.pickUpPointsCount}</td>
                </tr>
                <tr>
                    <th className="font-normal p-2">Склады</th>
                    <td className="text-lg text-right p-2">{data.stocksCount}</td>
                </tr>
            </tbody>
        </table>
    )
}
