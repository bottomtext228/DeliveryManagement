import useUserStore from "../store/user/userStore";
import { IUser } from "../types/types";

export const useUser = (): IUser | null | undefined => {
    const user = useUserStore(state => state.user);
    return user;
}