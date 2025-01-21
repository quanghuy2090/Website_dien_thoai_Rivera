import { useRoutes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import { Header } from "./components/Header";
import ClientLayout from "./layout/ClientLayout";
import ProductPage from "./pages/ProductPage";
import { Toaster } from "react-hot-toast";

function App() {
  const routes = useRoutes([
    {
      path: "",
      element: <ClientLayout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/product-page", element: <ProductPage /> },
      ],
    },
  ]);
  return (
    <>
      <Toaster/>
        {routes}
        <Header />
    </>
  );
}

export default App;
