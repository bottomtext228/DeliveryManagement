import { useQueries } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { getProductDetail } from "../../api/catalog/getProduct";
import { IProductDetail } from "../../types/types";

export const useProductsDetail = (ids: number[]) => useQueries({
    queries: ids.length ? ids.map(id => ({
        queryKey: ['product', id],
        queryFn: () => getProductDetail(id),
        enabled: !!id,
        select: (e: AxiosResponse<IProductDetail>) => e.data
    })) : []
});
