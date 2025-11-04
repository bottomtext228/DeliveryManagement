import { useQuery } from "@tanstack/react-query";
import { getRoads } from "../../api/map/getRoads";

export const useRoads = () => useQuery({
    queryKey: ['roads'],
    queryFn: async () => {
        const response = await getRoads();
        return response.data;
    }
});