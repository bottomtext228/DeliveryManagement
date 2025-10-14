import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../api/profile/getUserProfile";

export const useProfile = () => useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    select: e => e.data
});