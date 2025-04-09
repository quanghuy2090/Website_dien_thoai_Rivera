import React, { useEffect, useState } from "react";
import { getDetailUser } from "../../services/auth";
import { User } from "../../services/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

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
    nav("/history");
  };

  const handleUpdateProfile = () => {
    nav("/profile-update");
  };

  return (
    <div className="account-dashboard-container">
      <div className="dashboard-content">
        <h2>Thông Tin Tài Khoản</h2>
        {user ? (
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
            </div>
            <div className="profile-action">
              <button className="history-btn" onClick={handleHistoryPage}>
                Xem Lịch Sử Đơn Hàng
              </button>
              <button className="history-btn" onClick={handleUpdateProfile}>
                Sửa thông tin tài khoản
              </button>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin người dùng...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
