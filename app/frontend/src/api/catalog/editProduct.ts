import { EditProductDto } from "../../types/types";
import { instance } from "../axios.api";

export const editProduct = (id: number, data: EditProductDto) => {
    return instance.putForm(`/api/catalog/${id}`, data);
}
