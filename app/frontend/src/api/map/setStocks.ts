import { Town } from "../../types/types"
import { instance } from "../axios.api"

export const setStocks = (towns: Town[]) => {
    const response = instance.put('/api/stock', towns.map(e => e.id));
    return response;
}
