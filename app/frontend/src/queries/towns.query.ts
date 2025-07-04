import { queryOptions } from "@tanstack/react-query";
import { getTowns } from "../api/map/getTowns";

export const townsQueryOptions = () => queryOptions({
    queryKey: ['towns'],
    queryFn: getTowns
})