import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css"
const Admin = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };
  <div className="">
    {token && (
      <>
        <li>
          <a href="/login" onClick={handleLogout} className="nav-link">
            Logout
          </a>
        </li>
      </>
    )}
  </div>;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || user.role !== 1) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card text-center shadow p-4"
          style={{ maxWidth: "400px" }}
        >
          <div className="card-body">
            <div className="text-warning fs-1 mb-3">⚠️</div>
            <h1 className="card-title text-danger">Không thể truy cập</h1>
            <p className="card-text text-muted">
              Bạn không có quyền truy cập trang này
            </p>
            <Link to="/" className="btn btn-primary">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="body">
      <div className="d-flex">
        <div className="sidebar p-3">
          <div className="d-flex align-items-center mb-4">
            {/* <img src="https://storage.googleapis.com/a1aa/image/gQse4uPSwGVLnTgaUUCk8ki2BWFWAVTb5QXlSiIR5wQ.jpg" alt="" className="rounded-circle" width="40" height="40" /> */}
            <span className="ml-2 text-purple-600 h4 font-weight-bold"></span>
          </div>
          <div className="d-flex align-items-center mb-4">
            <img src="" alt="" />
            <div className="ml-2">
              {/* <p className="mb-0 font-weight-bold">David Grey. H</p>
            <p className="mb-0 text-muted">Project Manager</p> */}
            </div>
          </div>
          <nav className="nav flex-column">
            <a className="nav-link mb-3" href="/"><i className="fa-solid fa-house mr-2"></i>Trang chủ</a>
            <a className="nav-link mb-3" href="/admin/dashboard"><i className="fas fa-tachometer-alt mr-2"></i>Thống kê</a>
            <a className="nav-link mb-3" href="/admin/color"><i className="fa-solid fa-palette mr-2"></i>Màu sắc</a>
            <a className="nav-link mb-3" href="/admin/capacity"><i className="fas fa-icons mr-2"></i>Bộ nhớ</a>
            <a className="nav-link mb-3" href="/admin/category"><i className="fas fa-edit mr-2"></i>Danh mục</a>
            <a className="nav-link mb-3" href="/admin/products"><i className="fas fa-chart-bar mr-2"></i>Sản phẩm</a>
            <a className="nav-link mb-3" href="/admin/user"><i className="fas fa-user-lock mr-2"></i>Người dùng</a>
            <a className="nav-link mb-3" href="/admin/order"><i className="fa-solid fa-cart-shopping mr-2"></i>Đơn hàng</a>
            <a className="nav-link mb-3" href="#"><i className="fas fa-book mr-2"></i>Documentation</a>
          </nav>
        </div>
        <div className="flex-grow-1">
          <div className="header d-flex justify-content-between align-items-center px-4">
            {/* Logo + Title */}
            <div className="d-flex align-items-center">
              {/* <img src="../../image/logo.png" alt="Logo" width="40" height="40" className="rounded mr-2" /> */}
              <span className="text-purple-600 h4 font-weight-bold mb-0">Rivera Admin</span>
            </div>

            {/* Search bar */}
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Search projects"
                style={{ width: 600 }}
              />
            </div>

            {/* Notification + Profile */}
            <div className="d-flex align-items-center gap-3">
              <i className="fas fa-bell text-secondary cursor-pointer"></i>
              <i className="fas fa-envelope text-secondary cursor-pointer"></i>
              {/* <img
              src="/avatar.jpg"
              alt="User Avatar"
              className="rounded-circle"
              width="40"
              height="40"
            /> */}
              <span className="ml-2 font-weight-medium">{user.email}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default Admin;
