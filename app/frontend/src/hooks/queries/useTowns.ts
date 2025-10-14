import { useQuery } from "@tanstack/react-query";
import { getTowns } from "../../api/map/getTowns";

export const useTowns = () => useQuery({
    queryKey: ['towns'],
    queryFn: getTowns,
    select: e => e.data
})