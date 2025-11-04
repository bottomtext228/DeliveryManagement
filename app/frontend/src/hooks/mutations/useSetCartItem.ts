import { useMutation } from "@tanstack/react-query"
import { setCartItem } from "../../api/cart/setCartItem"
import { queryClient } from "../../queryClient"

export const useSetCartItem = () => useMutation({
    mutationFn: setCartItem,
    onSuccess: (updatedCart) => {
        queryClient.setQueryData(['cart'], updatedCart);
    },
})