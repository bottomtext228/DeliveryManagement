/* import Header from "./Header";
import Footer from "./Footer"; */
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
    return <>

{/* 
        <div className="flex flex-col min-h-screen">

            <header className="bg-blue-600 text-white text-center p-4">
                Header
            </header>


            <main className="flex-1 bg-gray-100 p-4">
                Main Content
            </main>

 
            <footer className="bg-blue-600 text-white text-center p-4">
                Footer
            </footer>
        </div> */}

          
        <Header></Header>
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer></Footer>

    </>
}