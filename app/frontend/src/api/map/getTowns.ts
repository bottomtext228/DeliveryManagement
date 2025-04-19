import { Town } from "../../types/types";
import { instance } from "../axios.api"

export const getTowns = () => {
    const response = instance.get<Town[]>('/api/map/towns');
    return response;
}
