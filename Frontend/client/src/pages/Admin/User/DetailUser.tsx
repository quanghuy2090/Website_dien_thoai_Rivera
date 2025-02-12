import React, { useEffect, useState } from 'react';
import { getDetailUser, updateRole, updateStatus, User } from '../../../services/auth';
import { useParams } from 'react-router-dom';


const DetailUser = () => {
    const { id } = useParams();
    const [users, setUsers] = useState<User | null>(null);

    useEffect(() => {
        const fetchDetailUser = async (_id: string) => {
            const res = await getDetailUser(_id);
            setUsers(res.data.data);
        };
        if (id) {
            fetchDetailUser(id);
        }
    }, [id]);

    const handleStatusChange = async (userId: string, status: string) => {
        try {
            const { data } = await updateStatus(userId, status);
            setUsers(prevUsers => prevUsers ? { ...prevUsers, status: data.user.status } : prevUsers);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    const handleRoleChange = async (userId: string, role: number) => {
        try {
            const { data } = await updateRole(userId, role);
            setUsers(prevUser => prevUser ? { ...prevUser, role: data.user.role } : prevUser);
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
            alert("Cập nhật thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className='detail-container col-md-10 ms-sm-auto px-md-4 mt-5'>
            <table className="table table-bordered table-striped">
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
    );
};

export default DetailUser;
