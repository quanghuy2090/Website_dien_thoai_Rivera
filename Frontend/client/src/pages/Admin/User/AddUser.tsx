import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { User } from '../../../services/auth'
import { AuthContext } from '../../../context/AuthContext'

const AddUser = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm<User>();
    const { createUser } = useContext(AuthContext);

    return (
        <div className="content">
            <div className="container  d-flex justify-content-center align-items-center mt-5">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-12 col-md-12">
                        <div className="text-center">
                            <h2 className="fw-bold text-primary">
                                Thêm mới User
                            </h2>
                            <p className="text-muted">
                                Quản lý user cho cửa hàng Rivera
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit((data) => createUser(data))}
                            className="p-5 border rounded shadow-sm bg-light"
                        >
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5" >
                                    Tên Người dùng
                                </label>
                                <input
                                    type="text" placeholder="Tên người dùng"
                                    className="form-control form-control-lg"{...register("userName", {
                                        required: "Không để trống tên", maxLength: {
                                            value: 100,
                                            message: "Nhiều nhất 100 ký tự",
                                        }
                                    })}

                                />
                                {errors?.userName && (
                                    <span className="text-danger mt-5 ">
                                        *{errors.userName.message}
                                    </span>
                                )}

                            </div>
                            <div className="form-group mb-5">
                                <label htmlFor="email" className="fw-bold fs-5" >
                                    Email
                                </label>
                                <input
                                    type="email" placeholder="Email"
                                    className="form-control form-control-lg"{...register("email", {
                                        required: "Không để trống Email", pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Không đúng định dạng Email",
                                        },
                                    })}

                                />
                                {errors?.email && (
                                    <span className="text-danger mt-5">
                                        *{errors.email.message}
                                    </span>
                                )}

                            </div>
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5" >
                                    Phone
                                </label>
                                <input
                                    type="text" placeholder="Số điện thoại"
                                    className="form-control form-control-lg"{...register("phone", { required: "Không để trống phone" })}

                                />
                                {errors?.phone && (
                                    <span className="text-danger mt-5">
                                        *{errors.phone.message}
                                    </span>
                                )}


                            </div>
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5" >
                                    Địa chỉ
                                </label>
                                <input
                                    type="text" placeholder="Địa chỉ"
                                    className="form-control form-control-lg"{...register("address", { required: "Không để trống address" })}

                                />
                                {errors?.address && (
                                    <span className="text-danger mt-5">
                                        *{errors.address.message}
                                    </span>
                                )}


                            </div>
                            <div className="form-group mb-5">
                                <label htmlFor="slug" className="fw-bold fs-5">
                                    Password
                                </label>
                                <input
                                    type="password" placeholder="Nhập mật khẩu"
                                    className="form-control form-control-lg"{...register("password", {
                                        required: "Không để trống mật khẩu", minLength: {
                                            value: 7,
                                            message: "Ít nhất 7 ký tự",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Nhiều nhất 255 ký tự",
                                        },
                                    })}

                                />
                                {errors?.password && (
                                    <span className="text-danger mt-5">
                                        *{errors.password.message}
                                    </span>
                                )}

                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="slug" className="fw-bold fs-5">
                                    confirmPassWord
                                </label>
                                <input
                                    type="password" placeholder="Xác nhận mật khẩu"
                                    className="form-control form-control-lg"{...register("confirmPassword", { required: "Không để trống xác nhận mật khẩu", })}

                                />
                                {errors?.confirmPassword && (
                                    <span className="text-danger mt-5">
                                        *{errors.confirmPassword.message}
                                    </span>
                                )}

                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100 py-3 fs-5">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser