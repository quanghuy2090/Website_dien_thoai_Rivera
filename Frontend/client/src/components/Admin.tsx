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
      <nav className="col-md-2 d-md-block bg-dark sidebar vh-100">
        <div className="position-sticky">
          <h2 className="text-white text-center py-3">Admin Panel</h2>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/">
                <i className="fas fa-home me-2"></i> Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/users">
                <i className="fas fa-users me-2"></i> Users
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/category">
                <i className="fas fa-tags me-2"></i> Categories
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/products">
                <i className="fas fa-box me-2"></i> Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/orders">
                <i className="fas fa-shopping-cart me-2"></i> Orders
              </a>
            </li>
          </ul>
        </div>

      </nav>
    </div>

  )
}

export default Admin