import useUserStore from "../store/user/userStore";
import { IUser } from "../types/types";


export const useAuth = (): boolean => {
    const user = useUserStore(state => state.user);
    return user !== null;
}

export const useUser = (): IUser | null => {
    const user = useUserStore(state => state.user);
    return user;
}