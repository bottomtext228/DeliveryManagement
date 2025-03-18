import { Link } from "react-router-dom";

export default function Footer() {
    return (
 
        <footer className="w-full mx-auto flex items-center justify-center gap-4 min-h-16">

                <Link to='/' className="">
                    <img className="w-24" src="/logo.png" alt="logo"></img>
                </Link>
                <div className="opacity-70 text-xs">
                    © {new Date().getFullYear()} Terrapin, Inc.
                </div>
                <Link to='/terms' className="opacity-70 text-xs">
                    Terms
                </Link>
                <Link to='/about' className="opacity-70 text-xs">
                    About Us
                </Link>
        </footer>
    )
}