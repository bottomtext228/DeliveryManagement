import { instance } from "../axios.api";

export const getProduct = (id: number) => {
    return instance.get(`/api/catalog/${id}`);
}