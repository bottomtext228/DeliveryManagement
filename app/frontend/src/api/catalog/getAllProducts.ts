import { IProduct, PaginatedResponseDto, ProductSortBy } from "../../types/types";
import { instance } from "../axios.api";

export const getAllProducts = (
    pageNumber = 1,
    pageSize = 20,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: ProductSortBy,
    isDescending?: boolean
) => {
    return instance.get<PaginatedResponseDto<IProduct>>('/api/catalog', {
        params: {
            pageNumber,
            pageSize,
            name,
            minPrice,
            maxPrice,
            sortBy,
            isDescending
        }
    });
}