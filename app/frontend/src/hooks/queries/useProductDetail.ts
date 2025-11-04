import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../api/catalog/getProduct";

export const useProductDetail = (id: number | null) => useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
        const response = await getProductDetail(id!);
        return response.data;
    },
    enabled: !!id
});