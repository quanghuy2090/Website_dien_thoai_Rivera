import React, { useEffect, useState } from "react";
import { getDetailUser, updateUser, User } from "../../services/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({
    _id: "",
    userName: "",
    email: "",
    address: "",
    phone: "",
    role: 0,
    status: "",
    img: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const fetchUser = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
        if (!userId) {
          setError("No user ID found.");
          return;
        }

        const { data } = await getDetailUser(userId);
        setUser(data.data);
        setUpdatedUser(data.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(updatedUser._id || "", {
        userName: updatedUser.userName || "",
        email: updatedUser.email || "",
        address: updatedUser.address || "",
        phone: updatedUser.phone || "",
        img: updatedUser.img || "",
      });
      toast.success("Cập nhật thông tin thành công!");
      nav("/profile");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile">
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/profile">Tài khoản</a>
                </li>
                <li className="active">Cập nhật thông tin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="update-profile-container">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="shadow-box">
                <div className="profile-content">
                  <h2>Cập nhật thông tin</h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {user && (
                    <form
                      onSubmit={handleSubmit}
                      className="update-profile-form"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="userName">Tên người dùng</label>
                            <input
                              type="text"
                              id="userName"
                              name="userName"
                              className="form-control"
                              value={updatedUser.userName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-control"
                              value={updatedUser.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              className="form-control"
                              value={updatedUser.phone || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              className="form-control"
                              value={updatedUser.address || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="img">Ảnh đại diện</label>
                        <div className="input-group">
                          <input
                            type="file"
                            id="img"
                            name="img"
                            className="form-control"
                            onChange={(e) => {
                              if (e.target.files) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setUpdatedUser({
                                    ...updatedUser,
                                    img: reader.result as string,
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        {updatedUser.img && (
                          <div className="img-upload-container">
                            <img
                              src={updatedUser.img}
                              alt="Ảnh đại diện"
                              className="img-thumbnail"
                            />
                          </div>
                        )}
                      </div> */}
                      <div className="form-group text-center">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
