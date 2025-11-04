import { Cart } from "../../types/types";
import { instance } from "../axios.api"

export const getCart = () => {
    return instance.get<Cart>('/api/cart');
}