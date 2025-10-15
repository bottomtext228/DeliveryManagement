import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../../api/company/getCompany";

export const useCompany = (companyId: number | null) => useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany(companyId!),
    enabled: !!companyId,
    select: e => e.data
});