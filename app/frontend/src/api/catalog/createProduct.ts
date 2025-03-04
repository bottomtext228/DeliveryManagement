import { CreateProductDto } from "../../types/types";
import { instance } from "../axios.api";


export const createProduct = (data: CreateProductDto) => {
    return instance.postForm('/api/catalog', data);
}
