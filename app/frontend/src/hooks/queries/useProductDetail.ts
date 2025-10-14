import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../api/catalog/getProduct";

export const useProductDetail = (id: number | null) => useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id!),
    enabled: !!id,
    select: e => e.data
});