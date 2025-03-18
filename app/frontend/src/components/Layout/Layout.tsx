/* import Header from "./Header";
import Footer from "./Footer"; */
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
    return <>         
        <Header></Header>
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer></Footer>

    </>
}