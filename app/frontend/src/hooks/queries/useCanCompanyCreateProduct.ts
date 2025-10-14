import { useQuery } from "@tanstack/react-query";
import { canCompanyCreateProduct } from "../../api/company/canCompanyCreateProduct";

export const useCanCompantCreateProduct = () => useQuery({
    queryFn: canCompanyCreateProduct,
    queryKey: ['can-create-product'],
    select: e => e.data
});