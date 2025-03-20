import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

export default function Layout() {
    return <>         
        <Header></Header>
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer></Footer>

    </>
}