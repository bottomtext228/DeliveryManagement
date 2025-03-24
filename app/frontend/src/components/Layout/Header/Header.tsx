import Navbar from "./Navbar";

export default function Header() {
    return (
        <header className="flex items-center justify-center w-full border-b border-b-gray-200 md:min-h-24 bg-gray-50">
            <Navbar></Navbar>
        </header>
    )
}