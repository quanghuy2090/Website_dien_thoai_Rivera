import { useEffect } from "react";

export function Header() {
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

  };

  useEffect(() => {
    const handleScroll = () => {
      const navBar = document.querySelector("nav");
      if (navBar) {
        if (window.scrollY > 0) {
          navBar.style.background = "white";
          navBar.style.boxShadow = "0 5px 20px rgba(190, 190, 190, 0.15)";
        } else {
          navBar.style.background = "transparent";
          navBar.style.boxShadow = "none";
        }
      }
    };

    // Add event listeners
    document.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener on unmount
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []); //

  return (
    <>
      <div className="">
        <nav>
          <div id="navbar">
            <div id="navbar-logo">
              <img
                src="image/eLife.png"
                alt="eLife, Company Ecommerce Logo"
                width="140"
                height="70"
              />
            </div>
            <div id="menu-bar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
            <div id="navbar-links">
              <ul>
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/product-page">Sản phẩm</a>
                </li>
                {!token && (
                  <>
                    <li>
                      <a href="/register">Đăng ký</a>
                    </li>
                    <li>
                      <a href="/login">Đăng nhập</a>
                    </li>
                  </>
                )}
                {token && (
                  <>
                    <li>
                      <a href="/admin">Admin</a>
                    </li>
                    <li>
                      <a href="/login" onClick={handleLogout}>
                        Logout
                      </a>
                    </li>
                  </>
                )}
              </ul>
              <div className="collection-tools" id="navbar-tools">
                <a className="cart-link" href="/cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="currentColor"
                    className="bi bi-bag"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                  </svg>
                  <span>0</span>
                </a>
                <a className="wishlist-link" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="currentColor"
                    className="bi bi-heart"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                  </svg>
                  <span>0</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
      </div>
    </>
  );
}
