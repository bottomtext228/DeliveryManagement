import { Link, useNavigate } from "react-router-dom";
import WarningCard from "../Common/WarningCard";

interface Props {
    message?: string
}

export default function ErrorPage({ message }: Props) {
    console.error(message);

    return (
        <WarningCard
            title="Что-то пошло не так..."
            message="Попробуйте повторить запрос позже."
            link="/"
            linkMessage="Главная"
        />
    )
}
