import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { User } from '../../../services/auth';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';

const UpdateUser = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<User>();
  const { updateUsers, getDetailUsers, state } = useContext(AuthContext);
  const { id } = useParams();
  // const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    (async () => {
      getDetailUsers(id!);
    })();
  }, []);

  useEffect(() => {
    reset(state.selectedUsers);
  }, [state.selectedUsers, reset]);

  const isTargetUserAdmin = state.selectedUsers?.role === 1;

  return (
    <div className="content p-4">
      <div className='card mb-4'>
        <div className='card-body'>
          <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
            <h3 className="fw-bold mb-3">Sửa Trạng Thái Người Dùng</h3>
            <p className="text-muted mb-4">Quản lý người dùng cho cửa hàng Rivera</p>
            {isTargetUserAdmin && (
              <div className="alert alert-danger text-center">
                Không thể chỉnh sửa thông tin của tài khoản <strong>Admin</strong>.
              </div>
            )}

            <form
              onSubmit={handleSubmit((data) => {
                if (!id || isTargetUserAdmin) {
                  console.warn("Không thể chỉnh sửa Admin hoặc ID không hợp lệ.");
                  return;
                }
                updateUsers(id, data);
              })}

            >

              {/* <div className="form-group mb-5">
                                <label className="fw-bold fs-5">Tên người dùng</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    {...register("name", { required: "Tên không được bỏ trống" })}
                                    disabled={isTargetUserAdmin}
                                />
                                {errors?.name && <span className="text-danger mt-2">*{errors.name.message}</span>}
                            </div>

                            <div className="form-group mb-5">
                                <label className="fw-bold fs-5">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    {...register("email", { required: "Email không được bỏ trống" })}
                                    disabled={isTargetUserAdmin}
                                />
                                {errors?.email && <span className="text-danger mt-2">*{errors.email.message}</span>}
                            </div> */}

              <div className="form-group mb-5">
                <label className="fw-bold fs-5">Trạng thái</label>
                <select
                  className="form-control form-control-lg"
                  {...register("status", { required: "Chọn trạng thái" })}
                  disabled={isTargetUserAdmin}
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
                    setValueAs: (v) => parseInt(v, 10),
                  })}
                  disabled={isTargetUserAdmin}
                >
                  <option value="0" disabled>-- Chọn vai trò --</option>
                  <option value="1">Admin</option>
                  <option value="2">Nhân viên</option>
                  <option value="3">Người dùng</option>
                </select>
              </div>

              {!isTargetUserAdmin && (
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    Lưu
                  </button>
                  <Link to={`/admin/user`} type="reset" className="btn btn-danger">
                    Hủy
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
