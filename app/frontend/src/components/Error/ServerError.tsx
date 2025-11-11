import { AxiosError, isAxiosError } from "axios"
import { ProblemDetails, ValidationProblemDetails } from "../../types/types";
import ErrorBorder from "./ErrorBorder";

interface Props {
    error: unknown
}

export default function ServerError({ error }: Props) {
    console.error(error);
    if (!isAxiosError(error)) {
        if (typeof error === "string") {
            return (<ErrorBorder><div>{error}</div></ErrorBorder>)
        }

        return <ErrorBorder><div>Что-то пошло не так...</div></ErrorBorder> // just in case
    }

    const axiosError = error as AxiosError;

    // Try to extract ProblemDetails
    const problemDetails = axiosError.response?.data as ProblemDetails;

    // extract errors if it's ValidationProblemDetails
    const validationErrors = (problemDetails as ValidationProblemDetails)?.errors;

    if (problemDetails) {
        return (
            <ErrorBorder>
                {/* Show title or default message */}
                <p className="mb-2">
                    {problemDetails?.detail || problemDetails?.title || "Произошла неизвестная ошибка."}
                </p>

                {/* Show validation errors if present */}
                {validationErrors && (
                    <ul className="list-disc list-inside space-y-1">
                        {Object.entries(validationErrors).map(([field, messages]) =>
                            messages.map((msg, idx) => (
                                <li key={`${field}-${idx}`}>
                                    {msg}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </ErrorBorder>
        );
    } else return (<ErrorBorder><div>Сервис временно недоступен.</div></ErrorBorder>);

};



