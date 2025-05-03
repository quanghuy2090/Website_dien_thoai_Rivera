import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Shipper.css"; // Bạn có thể dùng chung CSS nếu cần

const Shipper = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/orders/shipper/${user.id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error(err));
    }
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  // Kiểm tra quyền truy cập của shipper
  if (!user || user.role !== 4) {
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
              Trang này chỉ dành cho shipper
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
        {/* Sidebar */}
        <div className="sidebar p-3">
          <div className="d-flex align-items-center mb-4">
            <span className="text-purple-600 h4 font-weight-bold">
              Shipper Panel
            </span>
          </div>
          <nav className="nav flex-column">
            <a className="nav-link mb-3" href="/shipper/orders">
              <i className="fa-solid fa-cart-shopping mr-2"></i>Đơn hàng của tôi
            </a>
            <a className="nav-link mb-3" href="/login" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt mr-2"></i>Đăng xuất
            </a>
          </nav>
        </div>

        {/* Content chính */}
        <div className="flex-grow-1">
          <div className="header d-flex justify-content-between align-items-center px-4">
            {/* Logo + Title */}
            <div className="d-flex align-items-center">
              <span className="text-purple-600 h4 font-weight-bold mb-0">
                Shipper Dashboard
              </span>
            </div>

            {/* Search bar (optional, có thể thêm tính năng tìm kiếm nếu cần) */}
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm đơn hàng..."
                style={{ width: 600 }}
              />
            </div>

            {/* Notification + Profile */}
            <div className="d-flex align-items-center gap-3">
              <i className="fas fa-bell text-secondary cursor-pointer"></i>
              <i className="fas fa-envelope text-secondary cursor-pointer"></i>
              <span className="ml-2 font-weight-medium">{user.email}</span>
            </div>
          </div>

          {/* Nội dung đơn hàng */}
          <div className="container mt-4">
            <h2 className="mb-4">Danh sách đơn hàng</h2>
            {orders.length === 0 ? (
              <p>Không có đơn hàng nào.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Đơn hàng #{order._id}</h5>
                    <p className="card-text">
                      <strong>Khách hàng:</strong>{" "}
                      {order.shippingAddress.userName}
                    </p>
                    <p className="card-text">
                      <strong>Địa chỉ:</strong> {order.shippingAddress.street},{" "}
                      {order.shippingAddress.ward},{" "}
                      {order.shippingAddress.district},{" "}
                      {order.shippingAddress.city}
                    </p>
                    <p className="card-text">
                      <strong>Trạng thái:</strong>
                      <span className="ml-2 text-primary">{order.status}</span>
                    </p>
                    {/* Có thể thêm nút để shipper cập nhật trạng thái hoặc chi tiết đơn hàng */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipper;
