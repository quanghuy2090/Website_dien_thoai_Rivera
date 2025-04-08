import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { FaEye, FaPen } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import { IoMdAdd } from 'react-icons/io';
const ListUser = () => {
    const { state } = useContext(AuthContext);
    const getRoleName = (role: number) => {
        switch (role) {
            case 1:
                return "Admin";
            case 2:
                return "Nhân viên";
            case 3:
                return "Người dùng";
            default:
                return "Không xác định";
        }
    };
    return (
        <div className='content'>
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="fas fa-users me-2"></i> Quản lý Người dùng
            </h1>
            <p className="mb-4 text-secondary">
                Đây là danh sách người dùng trong hệ thống. Bạn có thể quản lý tài khoản, cập nhật thông tin hoặc chặn người dùng vi phạm.
            </p>

            <div className='table-container'>
                <Link to={`/admin/user/add`} className='btn btn-primary mb-3 w-100'> <IoMdAdd /></Link>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Stt</th>
                            <th scope="col">Họ & Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Địa Chỉ</th>
                            <th scope="col">Số Điện Thoại</th>
                            <th scope="col">Vai trò</th>
                            <th scope="col">Tùy chọn</th>


                        </tr>
                    </thead>
                    <tbody>
                        {state.users.map((u, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{u.userName}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.phone}</td>
                                <td>{getRoleName(u.role)}</td>
                                <td>

                                    <Link to={`/admin/user/${u._id}`} className='btn btn-warning'><FaEye /></Link>
                                    <Link to={`/admin/update/user/${u._id}`} className='btn btn-success'> <FaPen /></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ListUser