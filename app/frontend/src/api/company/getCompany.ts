import { Company } from "../../types/types";
import { instance } from "../axios.api"

export const getCompany = (id: number) => {
    return instance.get<Company>(`/api/company/${id}`);
}