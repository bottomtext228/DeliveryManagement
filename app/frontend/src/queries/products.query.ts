import { infiniteQueryOptions } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog/getAllProducts";

export const productsInfiniteQueryOptions = (pageSize: number) => infiniteQueryOptions({
    queryKey: ['products', pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) => getAllProducts(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) => {
        const { pageNumber, totalPages } = lastPageData.data;
        if (pageNumber < totalPages) {
            return pageNumber + 1;
        }
        return undefined;
    }
});