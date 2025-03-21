import useUserStore from "../../../store/user/userStore";
import { removeTokenFromLocalStorage } from "../../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthState, useAuthState, useUser } from "../../../hooks/useAuth";
import Dropdown from "./Dropdown";
import Navbar from "./Navbar";
import { useState } from "react";

export default function Header() {
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const logoutHandler = () => {
        logout();
        removeTokenFromLocalStorage();
        navigate('/');
    }

    const user = useUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        
        <nav className="bg-blue-600 p-4 shadow-md relative z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Brand</h1>
            
            <button
              className="text-white md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </nav>
        
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white p-4 transform transition-transform duration-300 z-20 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:flex md:space-x-6 md:bg-transparent md:w-auto md:p-0 md:translate-x-0`}
        >
          <ul className="space-y-4 md:space-y-0 md:flex md:space-x-6 text-lg">
            <li><a href="#" className="block p-2 hover:bg-blue-500 rounded">Home</a></li>
            <li><a href="#" className="block p-2 hover:bg-blue-500 rounded">About</a></li>
            <li><a href="#" className="block p-2 hover:bg-blue-500 rounded">Services</a></li>
            <li><a href="#" className="block p-2 hover:bg-blue-500 rounded">Contact</a></li>
          </ul>
        </div>
      </div>)


      /*   <header className="border-b border-b-gray-200 p-0.5 h-38 flex">
            <Navbar></Navbar>
        </header>) */
}