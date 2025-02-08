import React from 'react'
import { Link } from 'react-router-dom';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || user.role !== 1) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card text-center shadow p-4" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <div className="text-warning fs-1 mb-3">⚠️</div>
            <h1 className="card-title text-danger">Access Denied</h1>
            <p className="card-text text-muted">You don't have permission to access this page.</p>
            <Link to="/" className="btn btn-primary">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/"><i className="fas fa-users"></i>Home</a></li>
          <li><a href="/admin/users"><i className="fas fa-users"></i> Users</a></li>
          <li><a href="/admin/category"><i className="fas fa-tags"></i> Categories</a></li>
          <li><a href="/admin/products"><i className="fas fa-box"></i> Products</a></li>
          <li><a href="/admin/orders"><i className="fas fa-shopping-cart"></i> Orders</a></li>
        </ul>
      </div>
    </div>

  )
}

export default Admin