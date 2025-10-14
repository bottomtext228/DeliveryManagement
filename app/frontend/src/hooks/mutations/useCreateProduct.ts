import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../../api/catalog/createProduct";
import { queryClient } from "../../queryClient";

export const useCreateProduct = () => useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
    }
});