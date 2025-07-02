import { instance } from "../axios.api"

export const getStocks = () => {
    const response = instance.get('/api/stock');
    return response;
}
