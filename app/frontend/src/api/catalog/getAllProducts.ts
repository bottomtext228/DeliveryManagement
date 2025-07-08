import { IProduct, PaginatedResponseDto } from "../../types/types";
import { instance } from "../axios.api";

export const getAllProducts = (pageNumber = 1, pageSize = 20) => {
    return instance.get<PaginatedResponseDto<IProduct>>('/api/catalog', { params: { pageNumber, pageSize } });
}