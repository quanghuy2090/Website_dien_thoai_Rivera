import React, { useEffect, useState } from "react";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/nouislider.min.css";
import "../css/slick-theme.css";
import "../css/slick.css";
import "../css/style.css";
import { getDetailUser, User } from "../services/auth";

export function Header() {
  const [isNavActive, setIsNavActive] = useState<boolean>(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  let userName = "";
  if (user) {
    const parsedUser = JSON.parse(user);
    userName = parsedUser.userName || "User";  // Change 'userName' if necessary based on your user data structure
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Toggle mobile navigation
  const toggleNav = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents immediate closing when clicking inside
    setIsNavActive((prev) => !prev);
  };

  // Toggle cart dropdown
  const toggleCartDropdown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setIsCartDropdownOpen((prev) => !prev);
  };

  // Close dropdowns when clicking outside
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
      {/* TOP HEADER */}
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
                <i className="fa fa-map-marker" /> Trịnh Văn Bô, Nam Từ Liêm, Hà
                Nội
              </a>
            </li>
          </ul>
          <ul className="header-links pull-right">
            {/* <li>
              <a href="#">
                <i className="fa fa-dollar" /> VND
              </a>
            </li> */}
            {token && (
              <>
                <li>
                  <a href="#">
                    <i className="fa fa-user-o" /> {userName}
                  </a>
                </li>
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
            {/* LOGO */}
            <div className="col-md-3">
              <div className="header-logo mt-3">
                <a href="#" className="logo">
                  <img src="../../image/logo1.png" width={170} alt="Logo" />
                </a>
              </div>
            </div>
            {/* /LOGO */}
            {/* SEARCH BAR */}
            <div className="col-md-6">
              <div className="header-search">
                <form>
                  <select className="input-select">
                    <option value={0}>Danh mục</option>
                  </select>
                  <input className="input" placeholder="Tìm kiếm tại đây" />
                  <button className="search-btn">Tìm kiếm</button>
                </form>
              </div>
            </div>
            {/* /SEARCH BAR */}
            {/* ACCOUNT */}
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
                    <div className="qty">3</div>
                  </a>
                  {/* {isCartDropdownOpen && (
                    <div className="cart-dropdown">
                      <div className="cart-list">
                        <div className="product-widget">
                          <div className="product-img">
                            <img src="./img/product01.png" alt="Product 1" />
                          </div>
                          <div className="product-body">
                            <h3 className="product-name">
                              <a href="#">product name goes here</a>
                            </h3>
                            <h4 className="product-price">
                              <span className="qty">1x</span>$980.00
                            </h4>
                          </div>
                          <button className="delete">
                            <i className="fa fa-close" />
                          </button>
                        </div>
                      </div>
                      <div className="cart-summary">
                        <small>3 Item(s) selected</small>
                        <h5>SUBTOTAL: $2940.00</h5>
                      </div>
                      <div className="cart-btns">
                        <a href="#">View Cart</a>
                        <a href="#">
                          Checkout <i className="fa fa-arrow-circle-right" />
                        </a>
                      </div>
                    </div>
                  )} */}
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
