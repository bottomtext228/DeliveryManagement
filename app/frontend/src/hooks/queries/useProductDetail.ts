import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../api/catalog/getProduct";

export const useProductDetail = (id: number) => useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id)
});
