import { instance } from "../axios.api"

interface Order {
    id: number,
    productId: number,
    stockId: number,
    pickUpPointId: number,
    townIds: number[]
}

export const getOrders = () => {
    return instance.get<Order[]>('/api/order');
}