import React, { useEffect, useState } from "react";
import { getDetailUser, updateUser, User } from "../../services/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedUser, setUpdatedUser] = useState<User>({
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
        // Extract the userId from the token or from localStorage
        const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
        if (!userId) {
          setError("No user ID found.");
          return;
        }

        const { data } = await getDetailUser(userId);
        setUser(data.data);
        setUpdatedUser(data.data); // Populate form fields with the current user's info
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

    const token = localStorage.getItem("user");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Send update request with token authorization
      await updateUser(updatedUser._id);
      toast.success("Profile updated successfully!");
      nav("/profile"); // Redirect after successful update
    } catch (err) {
      setError("Failed to update profile.");
      setLoading(false);
    }
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
                <li>
                  <a href="/profile">Tài khoản</a>
                </li>
                <li className="active">Thông tin tài khoản</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="update-profile-container">
        <h2>Update Profile</h2>

        {error && <div className="error-message">{error}</div>}

        {user && (
          <form onSubmit={handleSubmit} className="update-profile-form">
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={updatedUser.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={updatedUser.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={updatedUser.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="img">Profile Image</label>
              <input
                type="file"
                id="img"
                name="img"
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
              {updatedUser.img && (
                <img
                  src={updatedUser.img}
                  alt="Profile Preview"
                  width="100"
                  height="100"
                  className="profile-image-preview"
                />
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UpdateProfile;
