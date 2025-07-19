import { UserProfileDto } from "../../types/types";
import { instance } from "../axios.api"

export const getUserProfile = () => {
    return instance.get<UserProfileDto>('/api/account/profile');
}