import { useMutation } from "@tanstack/react-query";
import { setStocks } from "../../api/stock/setStocks";
import { queryClient } from "../../queryClient";

export const useSetStocks = () => useMutation({
    mutationFn: setStocks,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stocks'] });
        queryClient.invalidateQueries({ queryKey: ['can-create-product'] });
    }
});