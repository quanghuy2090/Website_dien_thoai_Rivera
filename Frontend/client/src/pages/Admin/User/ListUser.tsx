import React, { useEffect, useState } from 'react'
import { getUser, User } from '../../../services/auth'

import { Link } from 'react-router-dom'

import { FaEye } from "react-icons/fa";
const ListUser = () => {
    const [user, setUser] = useState<User[]>([])

    console.log(user)
    useEffect(() => {
        (async () => {
            fetchUsers();
        })()
    }, [])
    const fetchUsers = async () => {
        const res = await getUser();
        setUser(res.data.data);
    }


    return (
        <div className='content'>
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="bi bi-people me-2"></i> Quản lý Người dùng
            </h1>
            <p className="mb-4 text-secondary">
                Đây là danh sách người dùng trong hệ thống. Bạn có thể quản lý tài khoản, cập nhật thông tin hoặc chặn người dùng vi phạm.
            </p>

            <div className='table-container'>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">username</th>
                            <th scope="col">email</th>
                            <th scope="col">address</th>
                            <th scope="col">phone</th>
                            <th scope="col">role</th>
                            <th scope="col">action</th>


                        </tr>
                    </thead>
                    <tbody>
                        {user.map((u) => (
                            <tr>
                                <td>{u._id}</td>
                                <td>{u.userName}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.phone}</td>
                                <td>{u.role}</td>
                                <td>

                                    <Link to={`/admin/user/${u._id}`} className='btn btn-warning'><FaEye /></Link>
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