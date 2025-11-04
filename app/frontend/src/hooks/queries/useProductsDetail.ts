import { useQueries } from "@tanstack/react-query";
import { getProductDetail } from "../../api/catalog/getProduct";

export const useProductsDetail = (ids: number[]) => useQueries({
    queries: ids.length ? ids.map(id => ({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await getProductDetail(id);
            return response.data;
        },
        enabled: !!id
    })) : []
});
