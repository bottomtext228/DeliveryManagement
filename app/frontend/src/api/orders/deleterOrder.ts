import { instance } from "../axios.api"

export const deleteOrder = (id: number) => {
    return instance.delete(`/api/order/${id}`);
}