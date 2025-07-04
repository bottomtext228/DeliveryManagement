import { queryOptions } from "@tanstack/react-query";
import { getOrders } from "../api/orders/getOrders";

export const ordersQueryOptions = () => queryOptions({
    queryKey: ['orders'],
    queryFn: getOrders
})