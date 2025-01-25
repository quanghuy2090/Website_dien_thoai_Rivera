import React from 'react'
import { Outlet } from 'react-router-dom'
import Admin from '../components/Admin'


const AdminLayout = () => {

  return (
    <div>
      <Admin />
      <Outlet />

    </div>
  )
}

export default AdminLayout
