import { infiniteQueryOptions } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog/getAllProducts";
import { ProductSortBy } from "../types/types";

export const productsInfiniteQueryOptions = (
    pageSize: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: ProductSortBy,
    isDescending?: boolean
) => infiniteQueryOptions({
    queryKey: ['products', pageSize, name, minPrice, maxPrice, sortBy, isDescending],
    queryFn: ({ pageParam }: { pageParam: number }) => getAllProducts(pageParam, pageSize, name, minPrice, maxPrice, sortBy, isDescending),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) => {
        const { pageNumber, totalPages } = lastPageData.data;
        if (pageNumber < totalPages) {
            return pageNumber + 1;
        }
        return undefined;
    }
});