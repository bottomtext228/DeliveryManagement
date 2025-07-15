import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/image.helper'
import { OrderItemDto } from '../../types/types'


interface Props {
    orderItem: OrderItemDto
}

export default function OrderItem({ orderItem }: Props) {
    return (
        <div className=''>
            <div className="flex gap-2">
                <Link to={`/catalog/${orderItem.product.id}`} className="w-22 h-22">
                    <img className="object-contain w-full h-full" src={getImageUrl(orderItem.product.image)}></img>
                </Link>
                <div className='flex flex-col'>
                    <div className="font-bold">
                        {orderItem.product.name}
                    </div>
                    <div className="flex items-center gap-2 text-base">
                        <span>{orderItem.productPrice}₽</span>
                        <span className="text-gray-500">&times; {orderItem.quantity}</span>
                        <span className="ml-auto font-semibold">= {orderItem.productPrice * orderItem.quantity}₽</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
