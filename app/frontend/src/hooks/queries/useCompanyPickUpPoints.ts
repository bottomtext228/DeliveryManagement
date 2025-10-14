import { useQuery } from "@tanstack/react-query";
import { getCompanyPickUpPoints } from "../../api/pickUpPoint/getCompanyPickUpPoints";

export const useCompanyPickUpPoints = (id: number) => useQuery({
    queryKey: ['companypickuppoints', id],
    queryFn: () => getCompanyPickUpPoints(id)
});