import { Link, useRoutes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const routes = useRoutes([
   
    { path: "register", element: <Register /> },
    { path: "login", element: <Login /> },
   
  ]);
  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
           
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul
              className="navbar-nav me-auto mb-2 mb-lg-0"
              style={{ gap: 3, fontSize: 20 }}
            >
              <li className="nav-item">
                <Link className="nav-link active" to="/">

                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">

                  Registr
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
             
            </ul>
          </div>
          
        </div>
      </nav>
      <div className="container">{routes}</div>
    </>
  );
}

export default App;