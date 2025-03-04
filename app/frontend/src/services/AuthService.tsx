import { getTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { IHtppValidationProblemDetails, ILoginData, IUser, IUserData } from "../types/types";

export const AuthService = {
    async registration(UserData: IUserData): Promise<IHtppValidationProblemDetails | undefined> {
        const data =
            await fetch('/api/account/register',
                {
                    method: 'POST',
                    body: JSON.stringify(UserData),
                    headers: {'Content-type': 'application/json'}
                });
        if (data.ok) return undefined;
        const problemDetails: IHtppValidationProblemDetails = await data.json();
        return problemDetails;
    },
    async login(UserData: IUserData): Promise<ILoginData | IHtppValidationProblemDetails> {
        const data = await (
            await fetch('/api/account/login', {
                method: 'POST', 
                body: JSON.stringify(UserData),
                headers: {'Content-type': 'application/json'}
            })).json();
        return data;
    },
    async getProfile(): Promise<IUser | undefined>{
        const data = await fetch('/api/account/profile', {
            headers: {
                'Authorization': 'Bearer ' + getTokenFromLocalStorage()
            }
            
        });
        if (data.ok) return data.json();
        return undefined;
     }
}