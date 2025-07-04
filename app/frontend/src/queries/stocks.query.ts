import { queryOptions } from "@tanstack/react-query";
import { getStocks } from "../api/stock/getStocks";

export const stocksQueryOptions = () => queryOptions({
    queryKey: ['stocks'],
    queryFn: getStocks
})