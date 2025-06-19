import { OrderItemDto } from '../../types/types'


interface Props {
    orderItem: OrderItemDto
}
export default function OrderItem({ orderItem }: Props) {
    return (
        <div className=''>
            <div className="flex">
                <div className="w-22 h-22">
                    <img className="object-contain w-full h-full" src={orderItem.product.image}></img>
                </div>
                <div className="font-bold">
                    {orderItem.product.name}
                </div>
            </div>

            <div>
                <div>Стоимость</div>
                <div>{orderItem.productPrice}₽<span>&times;{orderItem.quantity}</span><span>&#61;{orderItem.productPrice * orderItem.quantity}₽</span></div>
            </div>
        </div>
    )
}
