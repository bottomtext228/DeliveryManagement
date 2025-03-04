import { instance } from "../axios.api"

export const getRoads = () => {
    const response = instance.get('/api/map/roads');
    return response;
}
