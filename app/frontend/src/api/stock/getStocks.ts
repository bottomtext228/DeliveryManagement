import { Stock } from "../../types/types";
import { instance } from "../axios.api"

export const getStocks = () => {
    const response = instance.get<Stock[]>('/api/stock');
    return response;
}
