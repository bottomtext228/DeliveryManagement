import { useQuery } from "@tanstack/react-query";
import { getPickUpPoints } from "../../api/pickUpPoint/getPickUpPoints";

export const usePickUpPoints = (companyId: number | null) => useQuery({
    queryKey: ['pickuppoints'],
    queryFn: getPickUpPoints,
    enabled: !!companyId
});