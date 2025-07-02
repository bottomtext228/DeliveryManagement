import { instance } from "../axios.api"

export const getPickUpPoints = () => {
    const response = instance.get('/api/pickuppoint');
    return response;
}

