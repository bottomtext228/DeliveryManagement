import { Cart, CartItem } from "../../types/types"
import { instance } from "../axios.api"

export const setCartItem = (item: CartItem) => {
    return instance.post<Cart>('/api/cart', item);
}