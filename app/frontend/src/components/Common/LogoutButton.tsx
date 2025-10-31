import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/user/userStore";

interface Props {
    onClick?: () => void;
}

export default function LogoutButton({ onClick }: Props) {
    const navigate = useNavigate();
    const logout = useUserStore(state => state.logout);

    return (
        <button onClick={() => {
            onClick?.();
            navigate('/auth/login');
            setTimeout(() => logout(), 100); // hack
        }}
            className="p-2 mt-auto text-sm transition-colors duration-150 bg-white border rounded-lg w-18 text-rose-500 hover:text-white active:text-neutral-200 border-rose-500 hover:bg-red-600 active:bg-red-700">
            Выйти
        </button>
    )
} 