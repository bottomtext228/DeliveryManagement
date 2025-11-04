import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../api/profile/getUserProfile";

export const useProfile = () => useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
        const response = await getUserProfile();
        return response.data;
    }
});