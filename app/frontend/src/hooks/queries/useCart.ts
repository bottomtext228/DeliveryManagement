import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../api/cart/getCart";

export const useCart = (isClient = true) => useQuery({
    queryFn: getCart,
    queryKey: ['cart'],
    select: e => e.data,
    enabled: isClient
});