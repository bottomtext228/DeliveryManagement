import { formatHours } from "../../helpers/format.helper"
import { IOrder, OrderStatus } from "../../types/types"
import OrderItem from "./OrderItem"

interface Props {
    order: IOrder
    handleDeleteClick: (id: number) => void
}

function getOrderStatusText(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Pending:
            return 'Ожидание'
        case OrderStatus.Processing:
            return 'В обработке'
        case OrderStatus.Shipped:
            return 'В пути'
        case OrderStatus.Delivered:
            return 'Доставлен'
        case OrderStatus.Cancelled:
            return 'Отменён'
        case OrderStatus.Returned:
            return 'Возврат'
    }
}


export default function Order({ order, handleDeleteClick }: Props) {
    return (
        <>
            <div className="border border-gray-200 w-full min-h-32 gap-8 p-4 rounded-lg">
                <div className="flex flex-col gap-4">
                    {order.items.map(e => <OrderItem key={e.product.id} orderItem={e}></OrderItem>)}
                </div>

                <div className="flex gap-6 mt-4">
                    <div>
                        <div>Доставка</div>
                        <div>{order.shippingPrice}₽</div>
                    </div>
                    <div className="font-bold">
                        <div>Итого</div>
                        <div>{order.finalPrice}₽</div>
                    </div>
                    <div>
                        <div>Заказ от</div>
                        <div>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <div>Время пути</div>
                        <div>{formatHours(order.shippingTime)}</div>
                    </div>
                    <div>
                        <div>Статус</div>
                        <div>{getOrderStatusText(order.status)}</div>
                    </div>
                    <div className="ml-auto">
                        <button onClick={() => handleDeleteClick(order.id)} className="bg-red-600 hover:bg-red-700 transition-colors duration-150 font-semibold text-white p-2 rounded-lg">Отменить</button>
                    </div>
                </div>
            </div>
        </>
    )
}
