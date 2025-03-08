import React from 'react'
import { Link } from 'react-router-dom';
import "./Admin.css"
const Admin = () => {
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  <div className="">
    {token && (
      <>

        <li>
          <a href="/login" onClick={handleLogout} className='nav-link'>
            Logout
          </a>
        </li>
      </>
    )}

  </div>
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
    <div className='d-flex'>
      <div className="sidebar p-3">
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-smile fa-2x">
          </i>
          <div className="sidebar-brand-text mx-3">RIVERA ADMIN <sup>2</sup></div>
        </div>
        <nav className="nav flex-column">
          <a className="nav-link d-flex align-items-center" href="/">
            <i className="fas fa-home mr-2">
            </i>
            Home
          </a>
          <a className="nav-link d-flex align-items-center" href="/admin/dasboard">
            <i className="fas fa-tachometer-alt mr-2">
            </i>
            Dashboard
          </a>
          <a className="nav-link d-flex align-items-center" href="/admin/category">
            <i className="bi bi-list-ul mr-2">
            </i>
            Danh mục
          </a>
          <a className="nav-link d-flex align-items-center" href="/admin/products">
            <i className="bi bi-box mr-2">
            </i>
            Sản phẩm
          </a>
          <a className="nav-link d-flex align-items-center" href="/admin/user">
            <i className="bi bi-people mr-2">
            </i>
            User
          </a>
          <a className="nav-link d-flex align-items-center" href="/admin/order">
            <i className="bi bi-cart mr-2">
            </i>
            Order
          </a>
          <a className="nav-link d-flex align-items-center" href="#">
            <i className="fas fa-table mr-2">
            </i>
            Tables
          </a>
        </nav>
      </div>
      <div className='flex-grow-1 mb-4'>
        <div className="topbar d-flex justify-content-between align-items-center">
          <div className="input-group w-25">
            {/* <input type="text" className='form-control bg-light border-0 small' placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" /> */}

            {/* <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search">
                </i>
              </button>
            </div> */}
          </div>
          <div className="d-flex align-items-center">
            <div className="position-relative mr-3">
              <i className="fas fa-bell text-gray-600 fa-lg">
              </i>
              <span className="badge badge-danger badge-counter">
                3+
              </span>
            </div>
            <div className="position-relative mr-3">
              <i className="fas fa-envelope text-gray-600 fa-lg">
              </i>
              <span className="badge badge-danger badge-counter">
                7
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-gray-600 mr-2">
                {user.email}
              </span>

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Admin