import { useRoutes } from "react-router-dom";
import Register from "./pages/Client/Register";
// import { Header } from "./components/Header";
import ClientLayout from "./layout/ClientLayout";
import { Toaster } from "react-hot-toast";
import ProductDetail from "./pages/Client/ProductDetail";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AddCategories from "./pages/Admin/Categories/AddCategories";
import ListCategories from "./pages/Admin/Categories/ListCategories";
import UpdateCategories from "./pages/Admin/Categories/UpdateCategories";
import ListProduct from "./pages/Admin/Product/ListProduct";
import AddProduct from "./pages/Admin/Product/AddProduct";
import UpdateProduct from "./pages/Admin/Product/UpdateProduct";
import HomePage from "./pages/Client/Homepage";
import ListUser from "./pages/Admin/User/ListUser";
import DetailUser from "./pages/Admin/User/DetailUser";
import Cart from "./pages/Client/Cart";
import Notfound from "./pages/Client/Notfound";
import Bill from "./pages/Client/Bill";
import HistoryUser from "./pages/Client/HistoryUser";
import OrderDetail from "./pages/Admin/Order/OrderDetail";
import Orders from "./pages/Admin/Order/Orders";
import ListDetailCategory from "./pages/Admin/Categories/ListDetailCategory";
import DetailAdminProduct from "./pages/Admin/Product/DetailAdminProduct";
import ProductPage from "./pages/Client/ProductPage";
import Checkout from "./pages/Client/Checkout";
import Login from "./pages/Client/Login";
import ListColor from "./pages/Admin/Colors/ListColor";
import AddColor from "./pages/Admin/Colors/AddColor";
import ListCapacity from "./pages/Admin/Capacity/ListCapacity";
import AddCapacity from "./pages/Admin/Capacity/AddCapacity";
import UpdateColor from "./pages/Admin/Colors/UpdateColor";
import UpdateCapacity from "./pages/Admin/Capacity/UpdateCapacity";
function App() {
  const routes = useRoutes([
    {
      path: "",
      element: <ClientLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/cart", element: <Cart /> },
        { path: "/product-page", element: <ProductPage /> },
        { path: "/product/:id", element: <ProductDetail /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/bill", element: <Bill /> },
        { path: "/history", element: <HistoryUser /> }
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <Notfound /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "/admin/dasboard", element: <Dashboard /> },
        { path: "/admin/category", element: <ListCategories /> },
        { path: "/admin/category/add", element: <AddCategories /> },
        { path: "/admin/category/update/:id", element: <UpdateCategories /> },
        { path: "/admin/category/detail/:id", element: <ListDetailCategory /> },
        { path: "/admin/products", element: <ListProduct /> },
        { path: "/admin/products/add", element: <AddProduct /> },
        { path: "/admin/products/update/:id", element: <UpdateProduct /> },
        { path: "/admin/products/detail/:id", element: <DetailAdminProduct /> },
        { path: "/admin/user", element: <ListUser /> },
        { path: "/admin/user/:id", element: <DetailUser /> },
        { path: "/admin/order", element: <Orders /> },
        { path: "/admin/order/:id", element: <OrderDetail /> },
        { path: "/admin/color", element: <ListColor /> },
        { path: "/admin/color/add", element: <AddColor /> },
        { path: "/admin/color/update/:id", element: <UpdateColor /> },
        { path: "/admin/capacity", element: <ListCapacity /> },
        { path: "/admin/capacity/add", element: <AddCapacity /> },
        { path: "/admin/capacity/update/:id", element: <UpdateCapacity /> }
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
