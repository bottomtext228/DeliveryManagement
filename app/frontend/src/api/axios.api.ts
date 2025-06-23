import axios from 'axios'
import { getTokenFromLocalStorage, setTokenToLocalStorage, removeTokenFromLocalStorage } from '../helpers/localstorage.helper';
import useUserStore from '../store/user/userStore';

const instance = axios.create();

instance.interceptors.request.use((config) => {
    // add access token to all requests
    config.headers.Authorization = 'Bearer ' + getTokenFromLocalStorage()
    return config;
});

//TODO: store refresh token in HttpOnly cookie

// Indicates whether a token refresh is currently in progress
let isRefreshing = false;

// Queue of failed requests waiting for a token refresh to complete
let failedQueue: Array<{
    resolve: () => void;
    reject: (error: any) => void;
}> = [];

// Processes the queue of failed requests once the token is refreshed or refresh fails
const processQueue = (error: any) => {
    failedQueue.forEach(prom => {
        if (!error) {
            // Retry the original request after successful token refresh
            prom.resolve();
        } else {
            // Reject the original request if token refresh failed
            prom.reject(error);
        }
    });

    // Clear the queue
    failedQueue = [];
};

// Axios response interceptor to handle 401 errors and token refreshing
instance.interceptors.response.use(
    response => response, // Pass through successful responses
    async error => {
        
        // only attempt refresh if user has token
        if (!getTokenFromLocalStorage()) return Promise.reject(error); 

        const originalRequest = error.config;

        // If the response is 401 (unauthorized) and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If a refresh is already in progress, wait for it and retry the request afterward
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => {
                            // Retry the original request once the token is refreshed
                            resolve(instance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            // Mark the request as retried to prevent infinite loops
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token using the refresh token
                const response = await axios.post('/api/account/refresh', {}, { withCredentials: true });

                // Store the new tokens
                const newToken = response.data.token;
                setTokenToLocalStorage(newToken);

                // Retry all failed requests in the queue
                processQueue(null);

                // Retry the original request that caused the 401
                return instance(originalRequest);
            } catch (err) {
                // If refresh fails, reject all queued requests and logout
                processQueue(err);
                useUserStore.getState().logout();

                return Promise.reject(err);
            } finally {
                // Reset the refresh state
                isRefreshing = false;
            }
        }

        // If the error is not a 401 or already retried, just reject
        return Promise.reject(error);
    }
);

export { instance }