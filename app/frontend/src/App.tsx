import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { getTokenFromLocalStorage } from "./helpers/localstorage.helper";
import { AuthService } from "./services/AuthService";
import { useEffect } from "react";
import { IUser } from "./types/types";
import useUserStore from "./store/user/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    const login = useUserStore(state => state.login);
    const logout = useUserStore(state => state.logout);

    const checkAuth = async () => {
        const token = getTokenFromLocalStorage();
        try {
            if (token) {
                const data = await AuthService.getProfile();
                if (data) {
                    login(data as IUser);
                    return;
                }
            }
           
        } catch (error) {
            console.error(error);
        }
        
        logout(); 
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider >
        </>
    );
}

export default App;
