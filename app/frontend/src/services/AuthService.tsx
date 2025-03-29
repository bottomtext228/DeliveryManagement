import axios, { AxiosResponse } from "axios";
import { instance } from "../api/axios.api";
import { getTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { IHtppValidationProblemDetails, ILoginRequest, ILoginResponse, IRegisterRequest, IUser, } from "../types/types";

export const AuthService = {
    async registration(UserData: IRegisterRequest): Promise<AxiosResponse<ILoginResponse | IHtppValidationProblemDetails>> {
      /*   const data =
            await fetch('/api/account/register',
                {
                    method: 'POST',
                    body: JSON.stringify(UserData),
                    headers: { 'Content-type': 'application/json' }
                });
        return await data.json(); */
        return axios.post('/api/account/register', UserData);
    },
    async login(UserData: ILoginRequest): Promise<AxiosResponse<ILoginResponse | IHtppValidationProblemDetails>> {
        /*   const data = await (
              await fetch('/api/account/login', {
                  method: 'POST',
                  body: JSON.stringify(UserData),
                  headers: { 'Content-type': 'application/json' }
              })).json();
          return data; */

        return axios.post('/api/account/login', UserData);
    },
    async getProfile(): Promise<IUser | undefined> {
        const data = await fetch('/api/account/profile', {
            headers: {
                'Authorization': 'Bearer ' + getTokenFromLocalStorage()
            }

        });
        if (data.ok) return data.json();
        return undefined;
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