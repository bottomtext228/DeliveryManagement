import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/image.helper'
import { OrderItemDto } from '../../types/types'


interface Props {
    orderItem: OrderItemDto
}

export default function OrderItem({ orderItem }: Props) {
    return (
        <div>
            <div className="flex gap-2">
                <Link to={`/catalog/${orderItem.product.id}`} className="w-22 h-22">
                    <img className="object-contain rounded-xl w-full h-full" src={getImageUrl(orderItem.product.image)}></img>
                </Link>
                <div className='flex flex-col'>
                    <div className="font-bold">
                        {orderItem.product.name}
                    </div>
                    <div className="flex items-center gap-x-2 text-base">
                        <div>{orderItem.productPrice}₽</div>
                        <div className="text-gray-500">&times; {orderItem.quantity}</div>
                        <div>=</div>
                        <div className="ml-auto font-semibold">{orderItem.productPrice * orderItem.quantity}₽</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
