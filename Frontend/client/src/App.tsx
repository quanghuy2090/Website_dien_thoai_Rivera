import { Link, useRoutes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import { Header } from "./components/Header";

function App() {
  const routes = useRoutes([
   
    { path: "register", element: <Register /> },
    { path: "login", element: <Login /> },
  ]);
  return (
    <>
      {routes}
      <Header/>
    </>
  );
}

export default App;
