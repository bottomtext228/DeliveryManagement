import { instance } from "../axios.api";

export const deleteProduct = (id: number) => {
    return instance.delete(`/api/catalog/${id}`);
}
