import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../../api/orders/createOrder";
import { queryClient } from "../../queryClient";

export const useCreateOrder = () => useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
})