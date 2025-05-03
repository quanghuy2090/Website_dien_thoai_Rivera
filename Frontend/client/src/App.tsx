import { useRoutes } from "react-router-dom";
import Register from "./pages/Client/Register";
// import { Header } from "./components/Header";
import ClientLayout from "./layout/ClientLayout";
import { Toaster } from "react-hot-toast";
import ProductDetail from "./pages/Client/ProductDetail";
import AdminLayout from "./layout/AdminLayout";
import ShipperLayout from "./layout/ShipperLayout"; // Thêm import ShipperLayout
import Dashboard from "./pages/Admin/Dashboard";
import HomePage from "./pages/Client/Homepage";
import Cart from "./pages/Client/Cart";
import ProductPage from "./pages/Client/ProductPage";
import Checkout from "./pages/Client/Checkout";
import Bill from "./pages/Client/Bill";
import Profile from "./pages/Client/Profile";
import HistoryUser from "./pages/Client/HistoryUser";
import UpdateProfile from "./pages/Client/UpdateProfile";
import Login from "./pages/Client/Login";
import NotFound from "./pages/Client/Notfound";
import PaymentSuccess from "./pages/Client/Vnpay";
import ListCategories from "./pages/Admin/Categories/ListCategories";
import AddCategories from "./pages/Admin/Categories/AddCategories";
import UpdateCategories from "./pages/Admin/Categories/UpdateCategories";
import ListDetailCategory from "./pages/Admin/Categories/ListDetailCategory";
import ListCategoryDeleted from "./pages/Admin/Categories/ListCategoryDeleted";
import ListProduct from "./pages/Admin/Product/ListProduct";
import AddProduct from "./pages/Admin/Product/AddProduct";
import UpdateProduct from "./pages/Admin/Product/UpdateProduct";
import DetailAdminProduct from "./pages/Admin/Product/DetailAdminProduct";
import ListUser from "./pages/Admin/User/ListUser";
import DetailUser from "./pages/Admin/User/DetailUser";
import AddUser from "./pages/Admin/User/AddUser";
import UpdateUser from "./pages/Admin/User/UpdateUser";
import Orders from "./pages/Admin/Order/Orders";
import OrderDetail from "./pages/Admin/Order/OrderDetail";
import ListColor from "./pages/Admin/Colors/ListColor";
import ListDeleteColor from "./pages/Admin/Colors/ListDeleteColor";
import AddColor from "./pages/Admin/Colors/AddColor";
import UpdateColor from "./pages/Admin/Colors/UpdateColor";
import ListCapacity from "./pages/Admin/Capacity/ListCapacity";
import ListCapacityDeleted from "./pages/Admin/Capacity/ListCapacityDeleted";
import AddCapacity from "./pages/Admin/Capacity/AddCapacity";
import UpdateCapacity from "./pages/Admin/Capacity/UpdateCapacity";
import ShipperOrders from "./pages/Admin/Order/ShipperOrder";
import ShipperOrderDetail from "./pages/Admin/Order/ShipperOrderDetail";

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
        { path: "/bill/:id", element: <Bill /> },
        { path: "/history", element: <HistoryUser /> },
        { path: "/profile", element: <Profile /> },
        { path: "/profile-update", element: <UpdateProfile /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <NotFound /> },
    { path: "/payment-success", element: <PaymentSuccess /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "/admin/dashboard", element: <Dashboard /> },
        { path: "/admin/category", element: <ListCategories /> },
        { path: "/admin/category/add", element: <AddCategories /> },
        { path: "/admin/category/update/:id", element: <UpdateCategories /> },
        { path: "/admin/category/detail/:id", element: <ListDetailCategory /> },
        { path: "/admin/category/delete", element: <ListCategoryDeleted /> },
        { path: "/admin/products", element: <ListProduct /> },
        { path: "/admin/products/add", element: <AddProduct /> },
        { path: "/admin/products/update/:id", element: <UpdateProduct /> },
        { path: "/admin/products/detail/:id", element: <DetailAdminProduct /> },
        { path: "/admin/user", element: <ListUser /> },
        { path: "/admin/user/:id", element: <DetailUser /> },
        { path: "/admin/user/add", element: <AddUser /> },
        { path: "/admin/update/user/:id", element: <UpdateUser /> },
        { path: "/admin/order", element: <Orders /> },
        { path: "/admin/order/:id", element: <OrderDetail /> },
        { path: "/admin/color", element: <ListColor /> },
        { path: "/admin/color/deleted", element: <ListDeleteColor /> },
        { path: "/admin/color/add", element: <AddColor /> },
        { path: "/admin/color/update/:id", element: <UpdateColor /> },
        { path: "/admin/capacity", element: <ListCapacity /> },
        { path: "/admin/capacity/deleted", element: <ListCapacityDeleted /> },
        { path: "/admin/capacity/add", element: <AddCapacity /> },
        { path: "/admin/capacity/update/:id", element: <UpdateCapacity /> },
      ],
    },
    {
      path: "/shipper", // Thêm route cho shipper
      element: <ShipperLayout />, // Thêm layout cho shipper
      children: [
        { path: "/shipper/orders", element: <ShipperOrders /> }, // Danh sách đơn hàng của shipper
        { path: "/shipper/orders/:id", element: <ShipperOrderDetail /> }, // Chi tiết đơn hàng của shipper
        // Thêm các route khác cho shipper nếu cần
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
