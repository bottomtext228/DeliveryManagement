import { instance } from "../axios.api"

export const getPickUpPoints = () => {
    const response = instance.get('/api/pickuppoint');
    return response;
}

export const getCompanyPickUpPoints = (companyId: number) => {
    const response = instance.get(`/api/pickuppoint/${companyId}`);
    return response;
}
