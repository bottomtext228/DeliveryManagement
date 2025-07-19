import axios, { AxiosResponse } from "axios";
import { instance } from "../api/axios.api";
import { ValidationProblemDetails, ILoginRequest, ILoginResponse, IRegisterRequest, IUser, } from "../types/types";

export const AuthService = {
    async registration(UserData: IRegisterRequest): Promise<AxiosResponse<ILoginResponse | ValidationProblemDetails>> {
        return axios.post('/api/account/register', UserData);
    },
    async login(UserData: ILoginRequest): Promise<AxiosResponse<ILoginResponse | ValidationProblemDetails>> {
        return axios.post('/api/account/login', UserData);
    },
    async getMe(): Promise<AxiosResponse<IUser | undefined>> {
        return instance.get('/api/account/me');
    },
    async checkEmail(email: string): Promise<AxiosResponse<CheckEmailResponse, any>> {
        return instance.get<CheckEmailResponse>('/api/account/check_credentials', {
            params: {
                email: email
            }
        });
    }
}


interface CheckEmailResponse {
    available: boolean,
    message: string | null
}