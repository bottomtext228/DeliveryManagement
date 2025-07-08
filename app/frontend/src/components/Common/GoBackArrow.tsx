import { useNavigate } from "react-router-dom"

export default function GoBackArrow() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-20 p-2 mb-4 text-white rounded-lg bg-amber-500 hover:bg-amber-600">
            <img src="/arrow-left.svg" className="w-8"></img>
        </button>
    )
}
