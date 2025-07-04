import { queryOptions } from "@tanstack/react-query";
import { getRoads } from "../api/map/getRoads";

export const roadsQueryOptions = () => queryOptions({
    queryKey: ['roads'],
    queryFn: getRoads
})