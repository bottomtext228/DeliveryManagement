import { useNavigate } from "react-router-dom"

export default function GoBackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-20 p-2 mb-4 rounded-lg bg-amber-400 hover:bg-amber-500 active:bg-amber-600"
        >
            <img src="/arrow-left.svg" className="w-8" draggable={false}></img>
        </button>
    )
}
