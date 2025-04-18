import { CreateOrderDto } from "../../types/types";
import { instance } from "../axios.api";

export const createOrder = (dto: CreateOrderDto) => {
    return instance.post(`/api/order`, dto);
}