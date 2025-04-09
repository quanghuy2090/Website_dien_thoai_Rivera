import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { User } from '../../../services/auth';
import { AuthContext } from '../../../context/AuthContext';
import { useParams } from 'react-router-dom';

const UpdateUser = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<User>();
    const { updateUsers, getDetailUsers, state } = useContext(AuthContext);
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        (async () => {
            getDetailUsers(id!);
        })();
    }, []);

    useEffect(() => {
        reset(state.selectedUsers);
    }, [state.selectedUsers, reset]);

    const isCurrentUserAdmin = currentUser.role === 1; // Check if the current user is an admin

    return (
        <div className="content">
            <div className="container d-flex justify-content-center align-items-center mt-5">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-12 col-md-12">
                        <div className="text-center">
                            <h2 className="fw-bold text-primary">
                                Cập nhật thông tin người dùng
                            </h2>
                            <p className="text-muted">
                                Quản lý thông tin người dùng
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit((data) => {
                                if (!id) {
                                    console.error("ID is undefined");
                                    return;
                                }
                                // if (id === currentUser._id) {
                                //     delete data?.status;
                                //     delete data?.role;
                                // }

                                updateUsers(id, data);
                            })}
                            className="p-5 border rounded shadow-sm bg-light"
                        >
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5">Tên Người dùng</label>
                                <input
                                    type="text"
                                    placeholder="Tên người dùng"
                                    className="form-control form-control-lg"
                                    {...register("userName", {
                                        required: "Không để trống tên",
                                        maxLength: { value: 100, message: "Nhiều nhất 100 ký tự" }
                                    })}
                                />
                                {errors?.userName && <span className="text-danger mt-5">*{errors.userName.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="email" className="fw-bold fs-5">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control form-control-lg"
                                    {...register("email", {
                                        required: "Không để trống Email",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Không đúng định dạng Email"
                                        }
                                    })}
                                />
                                {errors?.email && <span className="text-danger mt-5">*{errors.email.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="phone" className="fw-bold fs-5">Phone</label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    className="form-control form-control-lg"
                                    {...register("phone", { required: "Không để trống phone" })}
                                />
                                {errors?.phone && <span className="text-danger mt-5">*{errors.phone.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="address" className="fw-bold fs-5">Địa chỉ</label>
                                <input
                                    type="text"
                                    placeholder="Địa chỉ"
                                    className="form-control form-control-lg"
                                    {...register("address", { required: "Không để trống address" })}
                                />
                                {errors?.address && <span className="text-danger mt-5">*{errors.address.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="password" className="fw-bold fs-5">Password</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    className="form-control form-control-lg"
                                    {...register("password", {
                                        required: "Không để trống mật khẩu",
                                        minLength: { value: 7, message: "Ít nhất 7 ký tự" },
                                        maxLength: { value: 255, message: "Nhiều nhất 255 ký tự" }
                                    })}
                                />
                                {errors?.password && <span className="text-danger mt-5">*{errors.password.message}</span>}
                            </div>
                            {/* 
                            <div className="form-group mb-5">
                                <label htmlFor="confirmPassword" className="fw-bold fs-5">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    className="form-control form-control-lg"
                                    {...register("confirmPassword", { required: "Không để trống xác nhận mật khẩu" })}
                                />
                                {errors?.confirmPassword && <span className="text-danger mt-5">*{errors.confirmPassword.message}</span>}
                            </div> */}

                            {/* Only show and disable the status and role fields if the current user is not an admin */}
                            <div className="form-group mb-5">
                                <label className="fw-bold fs-5">Trạng thái</label>
                                <select
                                    className="form-control form-control-lg"
                                    {...register("status", { required: "Chọn trạng thái" })}
                                    disabled={!isCurrentUserAdmin} // Disable for non-admin users
                                >
                                    <option value="0" disabled>-- Chọn trạng thái --</option>
                                    <option value="active">Active</option>
                                    <option value="banned">Banned</option>
                                </select>
                                {errors?.status && <span className="text-danger mt-2">*{errors.status.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label className="fw-bold fs-5">Vai trò</label>
                                <select
                                    className="form-control form-control-lg"
                                    {...register("role", {
                                        required: "Chọn vai trò",
                                        setValueAs: (v) => parseInt(v, 10), // Convert value to number
                                    })}
                                    disabled={!isCurrentUserAdmin} // Disable for non-admin users
                                >
                                    <option value="0" disabled>-- Chọn vai trò --</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Nhân viên</option>
                                    <option value="3">Người dùng</option>
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100 py-3 fs-5">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;
