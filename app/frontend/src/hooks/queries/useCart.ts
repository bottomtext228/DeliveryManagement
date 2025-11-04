import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../api/cart/getCart";

export const useCart = (isClient = true) => useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
        const response = await getCart();
        return response.data;
    },
    enabled: isClient
});