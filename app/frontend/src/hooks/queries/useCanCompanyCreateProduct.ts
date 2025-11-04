import { useQuery } from "@tanstack/react-query";
import { canCompanyCreateProduct } from "../../api/company/canCompanyCreateProduct";

export const useCanCompantCreateProduct = () => useQuery({
    queryKey: ['can-create-product'],
    queryFn: async () => {
        const response = await canCompanyCreateProduct();
        return response.data;
    }
});