import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="flex items-center justify-center w-full gap-2 mx-auto md:gap-4 min-h-16">

                <Link to='/' className="">
                    <img className="w-24 active:scale-98" src="/logo.png" alt="logo" draggable={false}></img>
                </Link>
                <div className="text-xs opacity-70">
                    © {new Date().getFullYear()} Terrapin, Inc.
                </div>
                <Link to='/terms' className="text-xs opacity-70 hover:opacity-80 active:opacity-90">
                    Terms
                </Link>
                <Link to='/about' className="text-xs opacity-70 hover:opacity-80 active:opacity-90">
                    About Us
                </Link>
        </footer>
    )
}