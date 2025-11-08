import { instance } from "../../api/axios.api";
import { removeTokenFromLocalStorage } from "../../helpers/localstorage.helper";
import { queryClient } from "../../queryClient";
import { IUser } from "../../types/types";
import { create } from "zustand";

interface UserState {
    user?: IUser | null;
    login: (data: IUser) => void;
    logout: () => void;
    updateCompany: (details: { name: string; description: string }) => void;
}

const useUserStore = create<UserState>((set) => ({
    user: undefined,
    login: (data: IUser) => {
        set({ user: data });
    },
    logout: async () => {
        try {
            await instance.post('/api/account/logout');
        }
        catch (error) {
            console.error(error);
        } finally {
            set({ user: null });
            removeTokenFromLocalStorage();
            queryClient.clear();
        }
    },
    updateCompany: (details: { name: string; description: string }) => {
        set((state) => ({
            user: state.user
                ? {
                    ...state.user,
                    company: state.user.company
                        ? {
                            ...state.user.company,
                            name: details.name,
                            description: details.description,
                        }
                        : { id: 0, name: details.name, description: details.description },
                }
                : undefined,
        }));
    }

}));

export default useUserStore;