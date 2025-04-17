import React, { useContext, useEffect, useState } from "react";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/nouislider.min.css";
import "../css/slick-theme.css";
import "../css/slick.css";
import "../css/style.css";
import { CartContext } from "../context/CartContext";


export function Header() {
  const [isNavActive, setIsNavActive] = useState<boolean>(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const { state } = useContext(CartContext);
  let userName = "";
  let userRole = null; // Initialize userRole
  let userImage = "";
  if (user) {
    const parsedUser = JSON.parse(user);
    userName = parsedUser.userName || "User";
    userRole = parsedUser.role; // Get the user's role
    userImage = parsedUser.image || "";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const toggleNav = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNavActive((prev) => !prev);
  };

  const toggleCartDropdown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setIsCartDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const navElement = document.getElementById("responsive-nav");
    const menuToggleElement = document.querySelector(".menu-toggle");

    if (
      navElement &&
      menuToggleElement &&
      !navElement.contains(e.target as Node) &&
      !menuToggleElement.contains(e.target as Node)
    ) {
      setIsNavActive(false);
    }
    setIsCartDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <div id="top-header">
        <div className="container">
          <ul className="header-links pull-left">
            <li>
              <a href="#">
                <i className="fa fa-phone" /> +8494 5533 843
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-envelope-o" /> email@email.com
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-map-marker" /> Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
              </a>
            </li>
          </ul>
          <ul className="header-links pull-right">
            {token && (
              <>
                <li>
                  <a href="/profile">
                    {userImage ? (
                      <img src={userImage} alt="User Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    ) : (
                      <i className="fa fa-user-o" />
                    )}
                    {userName}
                  </a>
                </li>
                {userRole === 1 && ( // Kiểm tra nếu người dùng là admin
                  <li>
                    <a href="/admin/dashboard">
                      <i className="fa fa-cog" /> Quản lý
                    </a>
                  </li>
                )}
                <li>
                  <a href="/" onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt" /> Đăng xuất
                  </a>
                </li>
              </>
            )}

            {!token && (
              <>
                <li>
                  <a href="/login">
                    <i className="fa fa-sign-in-alt" /> Đăng nhập
                  </a>
                </li>
                <li>
                  <a href="/register">
                    <i className="fa fa-user-plus" /> Đăng ký
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* /TOP HEADER */}
      {/* MAIN HEADER */}
      <div id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="header-logo mt-3">
                <a href="/" className="logo">
                  <img src="../../image/logo1.png" width={170} alt="Logo" />
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="header-search">
                <form>
                  <input className="input" placeholder="Tìm kiếm tại đây" />
                  <button className="search-btn">Tìm kiếm</button>
                </form>
              </div>
            </div>
            <div className="col-md-3 clearfix">
              <div className="header-ctn">
                <div>
                  <a href="#">
                    <i className="fa fa-heart-o" />
                    <span>Yêu thích</span>
                    <div className="qty">2</div>
                  </a>
                </div>
                <div className="dropdown">
                  <a
                    href="/cart"
                    className="dropdown-toggle"
                    onClick={toggleCartDropdown}
                    aria-expanded={isCartDropdownOpen}
                  >
                    <i className="fa fa-shopping-cart" />
                    <span>Giỏ hàng</span>
                    <div className="qty">{state.totalQuantity}</div>
                  </a>
                </div>
                <div className="menu-toggle" onClick={toggleNav}>
                  <a href="">
                    <i className="fa fa-bars" />
                    <span>Menu</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav id="navigation">
        <div className="container">
          <div id="responsive-nav" className={isNavActive ? "active" : ""}>
            <ul className="main-nav nav navi">
              <li className="active">
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/product-page">Sản phẩm</a>
              </li>
              <li>
                <a href="#">Khuyến mãi</a>
              </li>
              <li>
                <a href="#">Tin tức</a>
              </li>
              <li>
                <a href="#">Về chúng tôi</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}