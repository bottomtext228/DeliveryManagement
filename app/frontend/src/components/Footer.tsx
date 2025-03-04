import { Link } from "react-router-dom";

export default function Footer() {
    return <div>
        <div className="mx-auto text-white">@<Link className="hover:underline" to='/about'>Z-Team</Link> {new Date().getFullYear()}.</div>
    </div>
}