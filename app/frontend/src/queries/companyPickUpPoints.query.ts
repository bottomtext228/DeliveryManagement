import { queryOptions } from "@tanstack/react-query";
import { getCompanyPickUpPoints } from "../api/pickUpPoint/getCompanyPickUpPoints";

export const companyPickUpPointsQueryOptions = (id: number) => queryOptions({
    queryKey: ['companypickuppoints', id],
    queryFn: () => getCompanyPickUpPoints(id)
})