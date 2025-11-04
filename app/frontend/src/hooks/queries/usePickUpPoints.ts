import { useQuery } from "@tanstack/react-query";
import { getPickUpPoints } from "../../api/pickUpPoint/getPickUpPoints";

// used by company to retrieve its pick up points
export const usePickUpPoints = () => useQuery({
    queryKey: ['pickuppoints'],
    queryFn: async () => {
        const response = await getPickUpPoints();
        return response.data;
    }
});