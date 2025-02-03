import { useRoutes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
// import { Header } from "./components/Header";
import ClientLayout from "./layout/ClientLayout";
import ProductPage from "./pages/ProductPage";
import { Toaster } from "react-hot-toast";
import ProductDetail from "./pages/ProductDetail";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AddCategories from "./pages/Admin/Categories/AddCategories";
import ListCategories from "./pages/Admin/Categories/ListCategories";
import UpdateCategories from "./pages/Admin/Categories/UpdateCategories";
import ListProduct from "./pages/Admin/Product/ListProduct";
import AddProduct from "./pages/Admin/Product/AddProduct";

import UpdateProduct from "./pages/Admin/Product/UpdateProduct";
import Notfound from "./pages/Notfound";

function App() {
  const routes = useRoutes([
    {
      path: "",
      element: <ClientLayout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/product-page", element: <ProductPage /> },
        { path: "/product/:id", element: <ProductDetail /> },
      ],
    },
    { path: "*", element: <Notfound /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "/admin/dasboard", element: <Dashboard /> },
        { path: "/admin/category", element: <ListCategories /> },
        { path: "/admin/category/add", element: <AddCategories /> },
        { path: "/admin/category/update/:id", element: <UpdateCategories /> },
        { path: "/admin/products", element: <ListProduct /> },

        { path: "/admin/products/add", element: <AddProduct /> },
        { path: "/admin/products/add", element: <AddProduct /> },
        { path: "/admin/products/update/:id", element: <UpdateProduct /> },
      ],
    },
  ]);
  return (
    <>
      <Toaster />
      {routes}
      {/* <Header /> */}
    </>
  );
}

export default App;
