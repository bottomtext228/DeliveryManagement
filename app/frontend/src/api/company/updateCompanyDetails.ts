import { UpdateCompanyDetailsRequest } from "../../types/types";
import { instance } from "../axios.api"

export const updateCompanyDetails = (companyId: number, data: UpdateCompanyDetailsRequest) => {
    return instance.putForm(`/api/company/${companyId}`, data);
}