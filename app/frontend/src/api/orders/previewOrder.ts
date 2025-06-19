import { PreviewOrderRequest, PreviewOrderResponse } from "../../types/types";
import { instance } from "../axios.api";



export const previewOrder = (dto: PreviewOrderRequest) => {
    return instance.post<PreviewOrderResponse>("/api/order/preview", dto);
}