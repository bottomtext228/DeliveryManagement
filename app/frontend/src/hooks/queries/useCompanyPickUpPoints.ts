import { useQuery } from "@tanstack/react-query";
import { getCompanyPickUpPoints } from "../../api/pickUpPoint/getCompanyPickUpPoints";

// used by client to get company's pick up points
export const useCompanyPickUpPoints = (id: number | null) => useQuery({
    queryKey: ['companypickuppoints', id],
    queryFn: async () => {
        const response = await getCompanyPickUpPoints(id!);
        return response.data;
    },
    enabled: !!id
});