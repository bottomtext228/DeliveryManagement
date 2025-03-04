import { Link } from "react-router-dom";

export default function NotFound() {
    return <div className="text-center border rounded p-4 bg-neutral-600">
        <div>
            <div className="text-white">Resource not found. This might be not the page you are looking for...</div>
            <Link className="text-blue-400 hover:underline" to='/'>Home page</Link>
        </div>
    </div>
}