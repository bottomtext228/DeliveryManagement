import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { getTokenFromLocalStorage } from "./helpers/localstorage.helper";
import { AuthService } from "./services/AuthService";
import { useEffect } from "react";
import { IUser } from "./types/types";
import useUserStore from "./store/user/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient({
    defaultOptions:
    {
        queries: {
            staleTime: 1000 * 60,
            /*   staleTime: 1000 * 60, // 1 minute
              refetchOnWindowFocus: false,
              refetchOnReconnect: true,
              refetchOnMount: true, */
            retry: false,
        },
    },
});

let hasCheckedAuth = false;
function App() {
    const login = useUserStore(state => state.login);
    const logout = useUserStore(state => state.logout);

    const checkAuth = async () => {

        if (hasCheckedAuth) return; // only do it once when user loads the page first time
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

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider >
        </>
    );
}

export default App;
