import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
const DetailUser = () => {
    const { id } = useParams();
    const { getDetailUsers, state, handleStatusChange, handleRoleChange } = useContext(AuthContext);
    useEffect(() => {
        getDetailUsers(id!)
    }, [])
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
                            <td>{state.selectedUsers?.email}</td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>{state.selectedUsers?.password}</td>
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
                            <th>Trạng Thái</th>
                            <td>
                                <select className='form-select'
                                    value={state.selectedUsers?.status || ""}
                                    onChange={(e) => state.selectedUsers?._id && handleStatusChange(state.selectedUsers._id, e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="banned">Banned</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Vai Trò</th>
                            <td>
                                <select className='form-select'
                                    value={state.selectedUsers?.role || 0}
                                    onChange={(e) => state.selectedUsers?._id && handleRoleChange(state.selectedUsers._id, Number(e.target.value))}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
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
