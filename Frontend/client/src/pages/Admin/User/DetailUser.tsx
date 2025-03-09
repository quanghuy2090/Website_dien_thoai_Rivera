import React, { useEffect, useState } from 'react';
import { getDetailUser, updateRole, updateStatus, User } from '../../../services/auth';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const DetailUser = () => {
    const { id } = useParams();
    const [users, setUsers] = useState<User | null>(null);

    useEffect(() => {
        const fetchDetailUser = async (_id: string) => {
            const res = await getDetailUser(_id);
            setUsers(res.data.data);
            toast.success("User details successfully")
        };
        if (id) {
            fetchDetailUser(id);
        }
    }, [id]);

    const handleStatusChange = async (userId: string, status: string) => {
        try {
            const { data } = await updateStatus(userId, status);
            setUsers(prevUsers => prevUsers ? { ...prevUsers, status: data.user.status } : prevUsers);
            toast.success("Updated status successfully")
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Error: " + error)
        }
    };

    const handleRoleChange = async (userId: string, role: number) => {
        try {
            const { data } = await updateRole(userId, role);
            setUsers(prevUser => prevUser ? { ...prevUser, role: data.user.role } : prevUser);
            toast.success("Role updated successfully")
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
            toast.error("Error");
        }
    };

    return (
        <div className='content'>
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="fas fa-users me-2"></i> Chi Tiết Khách Hàng
            </h1>
            <p className="mb-4 text-secondary">
                Đây là thông tin chi tiết của khách hàng "<strong>{users?._id}</strong>". Bạn có thể xem thông tin và quản lý khách hàng tại đây.
            </p>
            <div className='table-container'>
                <table className="table table-bordered border-primary">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{users?._id}</td>
                        </tr>
                        <tr>
                            <th>Họ & Tên</th>
                            <td>{users?.userName}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{users?.email}</td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>{users?.password}</td>
                        </tr>
                        <tr>
                            <th>Địa Chỉ</th>
                            <td>{users?.address}</td>
                        </tr>
                        <tr>
                            <th>Số Điện Thoại</th>
                            <td>{users?.phone}</td>
                        </tr>
                        <tr>
                            <th>Vai trò</th>
                            <td>
                                <select
                                    value={users?.role}
                                    onChange={(e) => {
                                        if (users?._id) {
                                            handleRoleChange(users._id, Number(e.target.value));
                                        }
                                    }}
                                    className="form-select border-primary shadow-sm"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Trạng Thái</th>
                            <td>
                                <select
                                    value={users?.status}
                                    onChange={(e) => handleStatusChange(users?._id ?? "", e.target.value)}
                                    className="form-select border-primary shadow-sm"
                                >
                                    <option value="active" className="text-success">🟢 Active</option>
                                    <option value="banned" className="text-danger">🔴 Banned</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default DetailUser;
