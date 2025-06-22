import { useEffect } from "react";
import { getTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { AuthService } from "../services/AuthService";
import useUserStore from "../store/user/userStore";
import { IUser } from "../types/types";

let hasCheckedAuth = false;

export const useAuthCheck = () => {
    const login = useUserStore(state => state.login);
    const logout = useUserStore(state => state.logout);

    useEffect(() => {
        const checkAuth = async () => {
            if (hasCheckedAuth) return;
            hasCheckedAuth = true;

            const token = getTokenFromLocalStorage();

            if (token) {
                try {
                    const response = await AuthService.getProfile();
                    login(response.data as IUser);
                    return;
                } catch (error: any) {
                    console.error(error);
                }
            }

            logout();
        };

        checkAuth();
    }, []);
};