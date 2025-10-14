import { useQuery } from "@tanstack/react-query";
import { getRoads } from "../../api/map/getRoads";

export const useRoads = () => useQuery({
    queryKey: ['roads'],
    queryFn: getRoads,
    select: e => e.data
});