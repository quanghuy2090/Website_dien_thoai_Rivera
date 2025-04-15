import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Capacity } from '../../../services/capacity'
import { CapacityContext } from '../../../context/CapacityContext'
import { Link } from 'react-router-dom'

const AddCapacity = () => {
    const { createCapacity } = useContext(CapacityContext);
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Capacity>()
    return (
        <div className="content p-4">
            <div className='card mb-4'>
                <div className='card-body'>
                    <div style={{ maxWidth: '2000px', margin: '0 auto' }}>
                        <div className="card-body p-5">
                            <h3 className="fw-bold mb-3">Thêm mới Bộ nhớ Sản phẩm</h3>
                            <p className="text-muted mb-4">Quản lý bộ nhớ sản phẩm cho cửa hàng Rivera</p>

                            <form onSubmit={handleSubmit((data) => createCapacity(data))}>
                                <div className="form-group mb-5">
                                    <label htmlFor="value" className="form-label fw-semibold">
                                        Tên bộ nhớ
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        style={{ height: '60px', fontSize: '1.25rem', padding: '0.75rem 1rem' }}
                                        {...register("value")}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary px-4">
                                        Lưu
                                    </button>
                                    <Link to={`/admin/capacity`} type="reset" className="btn btn-danger">
                                        Hủy
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default AddCapacity