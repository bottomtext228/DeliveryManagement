import { ClientProfileDto, CompanyProfileDto } from "../../types/types";
import { instance } from "../axios.api"

export const getUserProfile = () => {
    return instance.get<ClientProfileDto | CompanyProfileDto>('/api/account/profile');
}