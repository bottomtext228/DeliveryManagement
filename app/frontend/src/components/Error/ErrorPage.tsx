import { AxiosError, isAxiosError } from "axios";
import WarningCard from "../Common/WarningCard";
import { ProblemDetails } from "../../types/types";

interface Props {
    error: unknown
}

export default function ErrorPage({ error }: Props) {
    console.error(error);
    
    if (!isAxiosError(error)) {
        return (
            <WarningCard
                title="Что-то пошло не так..."
                message="Попробуйте повторить запрос позже."
                link="/"
                linkMessage="Главная"
            />
        );
    }
    const axiosError = error as AxiosError;

    // Try to extract ProblemDetails
    const problemDetails = axiosError.response?.data as ProblemDetails;

    if (problemDetails) {
        return (
            <WarningCard
                title="Что-то пошло не так..."
                message={problemDetails.detail}
                link="/"
                linkMessage="Главная"
            />
        )
    } else {
        return (
            <WarningCard
                title="Сервис временно недоступен."
                message="Попробуйте повторить запрос позже."
                link="/"
                linkMessage="Главная"
            />
        )
    }
}
