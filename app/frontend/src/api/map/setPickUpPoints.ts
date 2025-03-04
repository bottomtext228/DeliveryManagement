import { Town } from "../../types/types"
import { instance } from "../axios.api"

export const setPickUpPoints = (towns: Town[]) => {
    const response = instance.put('/api/pickuppoint', towns.map(e => e.id));
    return response;
}
