import React from 'react'

const Admin = () => {
  return (
    <div>
      <div className="sidebar">
    <h2>Admin Panel</h2>
    <ul>
      <li><a href="/admin/users"><i className="fas fa-users"></i> Users</a></li>
      <li><a href="/admin/category"><i className="fas fa-tags"></i> Categories</a></li>
      <li><a href="/admin/analytics"><i className="fas fa-chart-bar"></i> Analytics</a></li>
      <li><a href="/admin/products"><i className="fas fa-box"></i> Products</a></li>
      <li><a href="/admin/orders"><i className="fas fa-shopping-cart"></i> Orders</a></li>
    </ul>
  </div>
   </div>
    
  )
}

export default Admin
