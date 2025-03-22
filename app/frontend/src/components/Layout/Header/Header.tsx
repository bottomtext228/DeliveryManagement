import Navbar from "./Navbar";
import { useState } from "react";

export default function Header() {


    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex w-full border-b border-b-gray-200 md:min-h-24 bg-gray-50 justify-center items-center">
            <button className="md:hidden ml-auto" onClick={() => setIsOpen(true)}>
                <img className='w-12 h-12 opacity-80' src='bars.svg'></img>
            </button>
            <Navbar></Navbar>
            <div id="overlay" onClick={() => setIsOpen(false)} className={`fixed z-[9] inset-0 ${isOpen ? 'block' : 'hidden'} bg-[rgba(0,0,0,0.1)] transition-colors duration-300`}></div>
        </header>)
}