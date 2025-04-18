import { IProductDetail } from "../../types/types";
import { instance } from "../axios.api";

export const getProductDetail = (id: number) => {
    return instance.get<IProductDetail>(`/api/catalog/${id}`);
}