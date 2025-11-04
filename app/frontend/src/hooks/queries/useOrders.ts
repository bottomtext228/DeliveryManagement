import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../api/orders/getOrders";

export const useOrders = () => useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
        const response = await getOrders();
        return response.data;
    }
});