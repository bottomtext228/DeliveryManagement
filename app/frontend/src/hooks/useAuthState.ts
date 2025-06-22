import useUserStore from "../store/user/userStore";

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
