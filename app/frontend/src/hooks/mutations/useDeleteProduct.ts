import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "../../api/catalog/deleteProduct";
import { queryClient } from "../../queryClient";

export const useDeleteProduct = () => useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
    }
});