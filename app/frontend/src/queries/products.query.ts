import { queryOptions } from "@tanstack/react-query";
import { getAllProducts } from "../api/catalog/getAllProducts";

export const productsQueryOptions = () => queryOptions({
    queryKey: ['products'],
    queryFn: getAllProducts
});