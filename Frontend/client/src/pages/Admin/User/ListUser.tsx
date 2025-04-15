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
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách người dùng</h5>
                        <span className="text-primary">Bảng / Người dùng</span>
                    </div>
                    <Link to={`/admin/user/add`} className='btn btn-primary mb-3'> <IoMdAdd />Thêm người dùng</Link>
                </div>


                <table className="table table-hover">
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
                                <th>{index + 1}</th>
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