import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../../api/company/getCompany";

export const useCompany = (companyId: number | null) => useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
        const response = await getCompany(companyId!);
        return response.data;
    },
    enabled: !!companyId
});