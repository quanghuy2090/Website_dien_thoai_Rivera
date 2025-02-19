import React from 'react'
import { Link } from 'react-router-dom';
import "./Admin.css"
const Admin = () => {
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
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
        <h4 className="text-center">Admin Panel</h4>
        <ul className="nav flex-column mt-4">

          <li className="nav-item">
            <a className="nav-link" href="/"><i className="bi bi-house-door-fill me-2"></i>Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/dasboard"><i className="bi bi-speedometer2 me-2"></i>Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/category"><i className="bi bi-collection seam me-2"></i>Category</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/products"><i className="bi bi-box-seam me-2"></i>Product</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/user"><i className="bi bi-people me-2"></i>Users</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="bi bi-card-checklist me-2"></i>Orders</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="bi bi-gear me-2"></i>Settings</a>
          </li>
        </ul>
      </div>
      <nav className="navbar navbar-expand-lg navbar-blue bg-blue">
        <div className="container-fluid">
          <button className="btn btn-outline-dark d-md-none me-2" type="button">
            <i className="bi bi-list"></i>
          </button>
          <a className="navbar-brand" href="#">Admin Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">{user.email}</a>
              </li>
              <li className="nav-item">
                {token && (
                  <>

                    <li>
                      <a href="/login" onClick={handleLogout} className='nav-link'>
                        Logout
                      </a>
                    </li>
                  </>
                )}

              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="content">
      </div>
    </div>

  )
}

export default Admin