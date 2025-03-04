import { instance } from "../axios.api"

export const getTowns = () => {
    const response = instance.get('/api/map/towns');
    return response;
}
