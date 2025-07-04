import { PickUpPoint } from "../../types/types";
import { instance } from "../axios.api"

export const getPickUpPoints = () => {
    const response = instance.get<PickUpPoint[]>('/api/pickuppoint');
    return response;
}

