import { useMutation } from "@tanstack/react-query";
import { deleteOrder } from "../../api/orders/deleterOrder";
import { queryClient } from "../../queryClient";

export const useDeleteOrder = () => useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
});