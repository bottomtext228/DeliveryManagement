import { useMutation } from "@tanstack/react-query";
import { editProduct } from "../../api/catalog/editProduct";
import { queryClient } from "../../queryClient";
import { EditProductDto } from "../../types/types";

export const useEditProduct = (id: number) => useMutation({
    mutationFn: (dto: EditProductDto) => editProduct(id, dto),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', id] });
    }
});