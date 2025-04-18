import { PickUpPoint } from "../../types/types";
import { instance } from "../axios.api";

export const getCompanyPickUpPoints = (companyId: number) => {
    const response = instance.get<PickUpPoint[]>(`/api/pickuppoint/${companyId}`);
    return response;
}
