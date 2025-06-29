import { ComputeRouteRequest, ComputeRouteResponse } from "../../types/types";
import { instance } from "../axios.api";



export const computeRoute = (dto: ComputeRouteRequest) => {
    return instance.post<ComputeRouteResponse>("/api/order/preview", dto);
}