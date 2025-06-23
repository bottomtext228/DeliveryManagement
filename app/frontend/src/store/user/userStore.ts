import { removeTokenFromLocalStorage } from "../../helpers/localstorage.helper";
import { IUser } from "../../types/types";
import { create } from "zustand";

interface UserState {
    user?: IUser | null,
    login: (data: IUser) => void,
    logout: () => void
}

const useUserStore = create<UserState>((set) => ({
    user: undefined,
    login: (data: IUser) => {
        set({ user: data });
    },
    logout: () => {
        set({ user: null });
        removeTokenFromLocalStorage();
    }
}));

export default useUserStore;