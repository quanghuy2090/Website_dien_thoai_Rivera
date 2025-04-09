import React, { useEffect, useState } from "react";
import { getDetailUser } from "../../services/auth";
import { User } from "../../services/auth";
import { toast } from "react-hot-toast";
import "../../css/auth.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          toast.error("Vui lòng đăng nhập");
          return nav("/login");
        }
        const parsedUser = JSON.parse(storedUser);
        const res = await getDetailUser(parsedUser._id);
        setUser(res.data.data);
      } catch (error: any) {
        toast.error("Lỗi tải thông tin người dùng");
      }
    };

    fetchUserDetail();
  }, [nav]);

  const handleHistoryPage = () => {
    nav("/history"); // Navigates to the history page
  };
  const handleUpdateProfile = () => {
    nav("/profile-update"); // Navigates to the history page
  };

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li className="active">Tài khoản</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="account-dashboard-container center-page">
        <div className="dashboard-content">
          <h2>Thông Tin Tài Khoản</h2>
          {user ? (
            <>
              {" "}
              <div className="profile-card">
                <div className="profile-avatar">
                  <img
                    src={
                      user.img ||
                      "https://cdn-icons-png.flaticon.com/512/3541/3541871.png"
                    }
                    alt="Avatar"
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-row">
                    <span className="profile-label">Tên tài khoản:</span>
                    <span className="profile-value">{user.userName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{user.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Số điện thoại:</span>
                    <span className="profile-value">
                      {user.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Địa chỉ:</span>
                    <span className="profile-value">
                      {user.address || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Vai trò:</span>
                    <span className="profile-value">
                      {user.role === 1
                        ? "Admin"
                        : user.role === 2
                        ? "Seller"
                        : "Khách hàng"}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Trạng thái:</span>
                    <span
                      className={`profile-value ${
                        user.status === "active"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : "Ngưng hoạt động"}
                    </span>
                  </div>
                </div>
                {/* History Button moved under the profile information */}
              </div>
              <div className="profile-action">
                <button className="history-btn" onClick={handleHistoryPage}>
                  Xem Lịch Sử Đơn Hàng
                </button>
                <button className="history-btn" onClick={handleUpdateProfile}>
                  Sửa thông tin tài khoản
                </button>
              </div>
            </>
          ) : (
            <p>Đang tải thông tin người dùng...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
