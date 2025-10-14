import { useQuery } from "@tanstack/react-query";
import { getStocks } from "../../api/stock/getStocks";

export const useStocks = () => useQuery({
    queryKey: ['stocks'],
    queryFn: getStocks
});