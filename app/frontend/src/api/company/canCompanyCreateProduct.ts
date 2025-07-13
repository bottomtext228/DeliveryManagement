import { CanCreateProductResponse } from "../../types/types";
import { instance } from "../axios.api";

export const canCompanyCreateProduct = () => {
    return instance.get<CanCreateProductResponse>('/api/company/can-create-product');
}