import { UpdateCompanyDetailsRequest } from "../../types/types";
import { instance } from "../axios.api"

export const updateCompanyDetails = (data: UpdateCompanyDetailsRequest) => {
    return instance.putForm(`/api/company`, data);
}