import useUserStore from "../store/user/userStore";
import { IUser } from "../types/types";

export enum AuthState {
    AUTHORIZED,
    PENDING,
    NOT_AUTHORIZED
}


export const useAuthState = (): AuthState => {
    const user = useUserStore(state => state.user);
    switch (user) {
        case undefined:
            return AuthState.PENDING;
        case null:
            return AuthState.NOT_AUTHORIZED; 
        default:
            return AuthState.AUTHORIZED;
    }
}

export const useUser = (): IUser | null | undefined => {
    const user = useUserStore(state => state.user);
    return user;
}