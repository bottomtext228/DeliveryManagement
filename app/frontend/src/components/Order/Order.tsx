import { IOrder } from "../../types/types"

interface Props {
    order: IOrder
}

// TODO: display most order fields
export default function Order({ order }: Props) {
    return (
        <>
            <div className="border border-gray-200 w-full h-32 gap-8 m-8 rounded-lg flex">
                <div className="flex">
                    <div className="w-16 h-16 m-4">
                        <img src={order.product.image}></img>
                    </div>
                    <div>
                        {order.product.name}
                    </div>
                </div>

                <div>
                    {order.productPrice}<span>&times;{order.quantity}</span><span>&#61;{order.productPrice * order.quantity}</span>
                </div>
                <div>
                    {order.shippingPrice}
                </div>
                <div className="font-bold">
                    {order.finalPrice}₽
                </div>
                <div>
                    {order.status}
                </div>
            </div>
        </>
    )
}
