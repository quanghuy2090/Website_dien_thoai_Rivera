import React, { useState } from "react";

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="container-fluid">
        {/* Navbar Start */}
        <div className="row align-items-center py-3 px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <a href="" className="text-decoration-none">
              <h1 className="m-0 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold px-3 mr-1">
                  Rivera
                </span>
              </h1>
            </a>
          </div>
          <div className="col-lg-6 col-6 text-left">
            <form action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm sản phẩm"
                />
                <div className="input-group-append">
                  <span className="input-group-text bg-transparent text-primary">
                    <i className="fa fa-search" />
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-3 col-6 text-right">
            <a href="" className="btn border">
              <i className="fas fa-heart text-primary" />
              <span className="badge">0</span>
            </a>
            <a href="" className="btn border">
              <i className="fas fa-shopping-cart text-primary" />
              <span className="badge">0</span>
            </a>
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="container-fluid mb-5 position-relative">
          <div className="row border-top px-xl-5">
            <div className="col-lg-3 d-none d-lg-block">
              <a
                className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
                onClick={toggleDropdown}
                style={{ height: 65, marginTop: "-1px", padding: "0 30px" }}
              >
                <h6 className="m-0">Danh mục</h6>
                <i className="fa fa-angle-down text-dark" />
              </a>
              {dropdownOpen && (
                <nav
                  className="navbar-vertical navbar-light align-items-start p-0 position-absolute"
                  style={{ height: 410, zIndex: 1000, left: 0, top: 65 }}
                >
                  <div className="navbar-nav w-100 overflow-hidden">
                    <a href="" className="nav-item nav-link">
                      Shirts
                    </a>
                    <a href="" className="nav-item nav-link">
                      Jeans
                    </a>
                    <a href="" className="nav-item nav-link">
                      Swimwear
                    </a>
                    <a href="" className="nav-item nav-link">
                      Sleepwear
                    </a>
                    <a href="" className="nav-item nav-link">
                      Sportswear
                    </a>
                    <a href="" className="nav-item nav-link">
                      Jumpsuits
                    </a>
                    <a href="" className="nav-item nav-link">
                      Blazers
                    </a>
                    <a href="" className="nav-item nav-link">
                      Jackets
                    </a>
                    <a href="" className="nav-item nav-link">
                      Shoes
                    </a>
                  </div>
                </nav>
              )}
            </div>

            {/* Other Navbar Content */}
            <div className="col-lg-9">
              <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
                <a href="" className="text-decoration-none d-block d-lg-none">
                  <h1 className="m-0 display-5 font-weight-semi-bold">
                    <span className="text-primary font-weight-bold px-3 mr-1">
                      Rivera
                    </span>
                  </h1>
                </a>
                <button
                  type="button"
                  className="navbar-toggler"
                  data-toggle="collapse"
                  data-target="#navbarCollapse"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse justify-content-start"
                  id="navbarCollapse"
                >
                  <div className="navbar-nav mr-auto py-0">
                    <a href="/" className="nav-item nav-link active">
                      Trang chủ
                    </a>
                    <a href="/product-page" className="nav-item nav-link">
                      Sản phẩm
                    </a>
                    <a href="" className="nav-item nav-link">
                      Giỏ hàng
                    </a>
                    {/* <a href="" className="nav-item nav-link">
                      Checkout
                    </a>

                    <a href="contact.html" className="nav-item nav-link">
                      Contact
                    </a> */}
                  </div>
                  <div className="navbar-nav ml-auto py-0">
                    {!token && (
                      <>
                        <a href="/login" className="nav-item nav-link">
                          Đăng nhập
                        </a>
                        <a href="/register" className="nav-item nav-link">
                          Đăng ký
                        </a>
                      </>
                    )}
                    {token && (
                      <>
                        <a href="" className="nav-item nav-link">
                          Tài khoản
                        </a>
                        <a
                          onClick={handleLogout}
                          href=""
                          className="nav-item nav-link"
                        >
                          Đăng xuất
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
        {/* Navbar End */}
      </div>
    </>
  );
}
