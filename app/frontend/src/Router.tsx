import { createBrowserRouter } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout/Layout";
import Register from "./pages/Auth/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Account from "./pages/Account/Account";
import Catalog from "./pages/Catalog/Catalog";
import CatalogDetail from "./pages/Catalog/CatalogDetail";
import CatalogAdd from "./pages/Catalog/CatalogAdd";
import CatalogEdit from "./pages/Catalog/CatalogEdit";
import Map from "./pages/Map/Map";
import Login from "./pages/Auth/Login";
import Terms from "./pages/Terms";
import Orders from "./pages/Orders/Orders";
import OrderAdd from "./pages/Orders/OrderAdd";

const router = createBrowserRouter(
    [
        {
            element: <Layout />,

            children: [
                {
                    path: "about",
                    element: <About />
                },
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "home",
                    element: <Home />,

                },
                {
                    path: "*",
                    element: <NotFound />
                },
                {
                    path: "auth/register",
                    element: <Register />
                },
                {
                    path: 'auth/login',
                    element: <Login />
                },
                {
                    path: 'account',
                    element: (<ProtectedRoute><Account /></ProtectedRoute>)
                },
                {
                    path: 'catalog',
                    element: (<ProtectedRoute><Catalog /></ProtectedRoute>)
                },
                {
                    path: 'catalog/add',
                    element: (<ProtectedRoute allowedRoles={['company']}><CatalogAdd /></ProtectedRoute>)
                },
                {
                    path: 'catalog/edit/:id',
                    element: (<ProtectedRoute allowedRoles={['company']}><CatalogEdit /></ProtectedRoute>)
                },
                {
                    path: 'catalog/:id',
                    element: (<ProtectedRoute><CatalogDetail /></ProtectedRoute>)
                },
                {
                    path: 'orders',
                    element: (<ProtectedRoute allowedRoles={['client']}><Orders /></ProtectedRoute>)
                },
                {
                    path: 'orders/add/:id',
                    element: (<ProtectedRoute allowedRoles={['client']}><OrderAdd /></ProtectedRoute>)
                },
                {
                    path: 'map',
                    element: (<ProtectedRoute><Map /></ProtectedRoute>)
                },
                {
                    path: 'terms',
                    element: <Terms />
                }

            ]
        }
    ]
)

export default router;
