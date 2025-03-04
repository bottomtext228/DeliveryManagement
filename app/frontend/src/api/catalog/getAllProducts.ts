import { instance } from "../axios.api";

export const getAllProducts = () => {
    return instance.get('/api/catalog');
}