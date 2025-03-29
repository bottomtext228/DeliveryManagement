import { AxiosError, isAxiosError } from "axios"
import { IHtppValidationProblemDetails } from "../types/types"

export type IServerError = AxiosError<IHtppValidationProblemDetails | null> | string;

interface Props {
    error: IServerError
}

export default function ServerError({ error }: Props) {
    if (isAxiosError(error)) return ShowAxiosError(error);

    return <li>{error}</li>
}

function ShowAxiosError(error: AxiosError) {
    switch (error.response?.status) {
        case 400: {
            const data = error.response.data as IHtppValidationProblemDetails;
            if (data.errors) return Object.keys(data.errors).map(key => <li key={key}>{(data.errors as any)[key]}</li>);
            return <li>Bad request</li>
        }
        case 401: return <li>Неправильная почта и/или пароль</li>
        case 500: return <li>Сервис временно недоступен</li>
    }
}