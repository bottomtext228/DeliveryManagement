import WarningCard from "../../components/Common/WarningCard";

export default function AlreadyLoggedIn() {
    return (
        <WarningCard
            title="Вы уже вошли в аккаунт"
            link="/"
            linkMessage="Главная"
        />
    )
}