import { queryOptions } from "@tanstack/react-query";
import { getUserProfile } from "../api/profile/getUserProfile";

export const profileQueryOptions = () => queryOptions({
    queryKey: ['profile'],
    queryFn: getUserProfile
})