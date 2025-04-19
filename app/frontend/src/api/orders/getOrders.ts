import { IOrder } from "../../types/types";
import { instance } from "../axios.api"

export const getOrders = () => {
    return instance.get<IOrder[]>('/api/order');
}