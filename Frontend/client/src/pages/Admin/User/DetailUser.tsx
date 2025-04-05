import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { User } from '../../../services/auth';
const DetailUser = () => {
    const { id } = useParams();
    const { getDetailUsers, state } = useContext(AuthContext);
    const [lockedEmails, setLockedEmails] = useState<User[]>([]);
    console.log(lockedEmails)
    useEffect(() => {
        getDetailUsers(id!);
        const storedEmails = JSON.parse(localStorage.getItem("user") || "[]"); // Đảm bảo không parse null
        setLockedEmails(storedEmails);
    }, [])
    // const isEmailLocked = Array.isArray(lockedEmails) && lockedEmails.includes(state.selectedUsers?.email);
    // const isAdmin = state.selectedUsers?.role === 1; // 
    const getRoleName = (role: number) => {
        switch (role) {
            case 1:
                return "Admin";
            case 2:
                return "Quản lý";
            case 3:
                return "Người dùng";
            default:
                return "Không xác định";
        }
    };
    return (
        <div className='content'>
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="fas fa-users me-2"></i> Chi Tiết Khách Hàng
            </h1>
            <p className="mb-4 text-secondary">
                Đây là thông tin chi tiết của khách hàng "<strong>{state.selectedUsers?._id}</strong>". Bạn có thể xem thông tin và quản lý khách hàng tại đây.
            </p>
            <div className='table-container'>
                <table className="table table-bordered border-primary">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{state.selectedUsers?._id}</td>
                        </tr>
                        <tr>
                            <th>Họ & Tên</th>
                            <td>{state.selectedUsers?.userName}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={state.selectedUsers?.email}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Địa Chỉ</th>
                            <td>{state.selectedUsers?.address}</td>
                        </tr>
                        <tr>
                            <th>Số Điện Thoại</th>
                            <td>{state.selectedUsers?.phone}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>{state.selectedUsers?.status}</td>
                        </tr>
                        <tr>
                            <th>Vai trò</th>
                            <td>{state.selectedUsers && state.selectedUsers.role !== undefined ? getRoleName(state.selectedUsers.role) : "N/A"}</td>
                        </tr>
                        <tr>
                            <th>Ngày tạo</th>
                            <td>{state.selectedUsers?.createdAt ? new Date(state.selectedUsers.createdAt).toLocaleDateString() : "N/A"}</td>

                        </tr>
                        <tr>
                            <th>Cập nhật lần cuối</th>
                            <td>{state.selectedUsers?.updatedAt ? new Date(state.selectedUsers.updatedAt).toLocaleString() : "N/A"}</td>
                        </tr>
                        {/* <tr>
                            <th>Người thực hiện	</th>
                            <td>{state.selectedUsers?.updatedBy.email}-{state.selectedUsers?.updatedBy.userName}</td>
                        </tr> */}
                        {/* <tr>
                            <th>Trạng Thái</th>
                            <td>
                                <select className='form-select'
                                    value={state.selectedUsers?.status || ""}
                                    onChange={(e) => state.selectedUsers?._id && handleStatusChange(state.selectedUsers._id, e.target.value)}
                                    disabled={isAdmin} // Không cho chỉnh sửa nếu là Admin
                                >
                                    <option value="active">Active</option>
                                    <option value="banned">Banned</option>
                                </select>
                            </td>
                        </tr> */}
                        {/* <tr>
                            <th>Vai Trò</th>
                            <td>
                                <select className='form-select'
                                    value={state.selectedUsers?.role || 0}
                                    onChange={(e) => state.selectedUsers?._id && handleRoleChange(state.selectedUsers._id, Number(e.target.value))}
                                    disabled={isAdmin} // Không cho chỉnh sửa nếu là Admin
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">Quản lý</option>
                                    <option value="3">Người dùng</option>
                                </select>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default DetailUser;
