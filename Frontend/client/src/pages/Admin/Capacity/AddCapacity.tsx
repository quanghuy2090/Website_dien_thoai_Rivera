import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Capacity } from '../../../services/capacity'
import { CapacityContext } from '../../../context/CapacityContext'

const AddCapacity = () => {
    const { createCapacity } = useContext(CapacityContext);
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Capacity>()
    return (
        <div className="content">
            <div className="container  d-flex justify-content-center align-items-center mt-5">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-12 col-md-12">
                        <div className="text-center">
                            <h2 className="fw-bold text-primary">
                                Thêm mới Bộ nhớ Sản phẩm
                            </h2>
                            <p className="text-muted">
                                Quản lý bộ nhớ sản phẩm cho cửa hàng Rivera
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit((data) => createCapacity(data))}
                            className="p-5 border rounded shadow-sm bg-light"
                        >
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5">
                                    Tên bộ nhớ
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    {...register("value")}
                                />

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

export default AddCapacity