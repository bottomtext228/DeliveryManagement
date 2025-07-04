import { queryOptions } from "@tanstack/react-query";
import { getPickUpPoints } from "../api/pickUpPoint/getPickUpPoints";

export const pickUpPointsQueryOptions = () => queryOptions({
    queryKey: ['pickuppoints'],
    queryFn: getPickUpPoints
})