import axios, { isAxiosError } from 'axios'
import { getRefreshTokenFromLocalStoage, getTokenFromLocalStorage, removeRefreshTokenFromLocalStorage, removeTokenFromLocalStorage, setRefreshTokenFromLocalStorage, setTokenToLocalStorage } from '../helpers/localstorage.helper'
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from '../types/types';

const instance = axios.create();

instance.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + getTokenFromLocalStorage()
    return config;
});

instance.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
/*             originalRequest._retry = true;
 */
            try {
                const refreshToken = getRefreshTokenFromLocalStoage();
                const requestDto: RefreshTokenRequestDto = { refreshToken: refreshToken }
                const response = await axios.post<RefreshTokenResponseDto>('/api/account/refresh', requestDto);

                const data = response.data;
                setTokenToLocalStorage(data.token);
                setRefreshTokenFromLocalStorage(data.refreshToken);

                originalRequest.headers.Authorization = 'Bearer ' + data.token;
                originalRequest._retry = true;
                return instance(originalRequest);
            }
            catch (error) {
                if (isAxiosError(error)) {
                    removeTokenFromLocalStorage();
                    removeRefreshTokenFromLocalStorage();
                }
            }
        }
    }
);
export { instance }