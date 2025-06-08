import { IOrder, OrderStatus } from "../../types/types"

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

// TODO: display most order fields
export default function Order({ order, handleDeleteClick }: Props) {
    return (
        <>
            <div className="border border-gray-200 w-full min-h-32 gap-8 p-2 rounded-lg flex flex-wrap">
                <div className="flex">
                    <div className="w-22 h-22">
                        <img className="object-contain w-full h-full" src={order.product.image}></img>
                    </div>
                    <div className="font-bold">
                        {order.product.name}
                    </div>
                </div>

                <div>
                    <div>Стоимость</div>
                    <div>{order.productPrice}₽<span>&times;{order.quantity}</span><span>&#61;{order.productPrice * order.quantity}₽</span></div>
                </div>
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
                    <div>{order.shippingTime}</div>
                </div>
                <div>
                    <div>Статус</div>
                    <div>{getOrderStatusText(order.status)}</div>
                </div>
                <div className="ml-auto">
                    <button onClick={() => handleDeleteClick(order.id)} className="bg-red-600 hover:bg-red-700 transition-colors duration-150 font-semibold text-white p-2 rounded-lg">Отменить</button>
                </div>
            </div>
        </>
    )
}
