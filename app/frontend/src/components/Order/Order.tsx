import { formatHours, formatOrderStatus } from "../../helpers/format.helper"
import { IOrder } from "../../types/types"
import OrderItem from "./OrderItem"

interface Props {
    order: IOrder
    handleDeleteClick: (id: number) => void
}

export default function Order({ order, handleDeleteClick }: Props) {
    return (
        <>
            <div className="border border-gray-200 w-full min-h-32 gap-8 p-4 rounded-xl">
                <div className="flex flex-col">
                    {order.items.map(e => (
                        <div key={e.product.id} className="py-3 first:pt-0 border-b border-gray-200">
                            <OrderItem orderItem={e}></OrderItem>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                    <div>
                        <div className="text-gray-600 text-sm">Доставка</div>
                        <div>{order.shippingPrice}₽</div>
                    </div>
                    <div className="font-bold">
                        <div className="text-gray-600 text-sm">Итого</div>
                        <div>{order.finalPrice}₽</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-sm">Заказ от</div>
                        <div>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-sm">Время пути</div>
                        <div>{formatHours(order.shippingTime)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-sm">Статус</div>
                        <div>{formatOrderStatus(order.status)}</div>
                    </div>
                    <div className="ml-auto">
                        <button onClick={() => handleDeleteClick(order.id)} className="font-semibold p-2 rounded-lg text-white hover:text-neutral-100 active:text-neutral-200 bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-98 transition-colors duration-150">Отменить</button>
                    </div>
                </div>
            </div>
        </>
    )
}
