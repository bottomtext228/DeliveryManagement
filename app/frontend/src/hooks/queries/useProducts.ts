import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../api/catalog/getAllProducts";
import { ProductSortBy } from "../../types/types";

export const useProducts = (
    pageSize: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: ProductSortBy,
    isDescending?: boolean
) => useInfiniteQuery({
    queryKey: ['products', pageSize, name, minPrice, maxPrice, sortBy, isDescending],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
        const response = await getAllProducts(pageParam, pageSize, name, minPrice, maxPrice, sortBy, isDescending);
        return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPageData) => {
        const { pageNumber, totalPages } = lastPageData;
        if (pageNumber < totalPages) {
            return pageNumber + 1;
        }
        return undefined;
    }
});