export function Header() {
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
  };
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <a className="navbar-brand" href="/">
              Rivera
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/about">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/product-page">
                    Product
                  </a>
                </li>
                {!token && (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/register">
                        Register
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/login">
                        Login
                      </a>
                    </li>
                  </>
                )}
                {token && (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/admin">
                        Admin
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="/login"
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <a className="nav-link" href="/cart">
                    Cart
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
      </div>
    </>
  );
}
