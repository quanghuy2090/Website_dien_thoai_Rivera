import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Capacity } from '../../../services/capacity';
import { CapacityContext } from '../../../context/CapacityContext';

const UpdateCapacity = () => {
    const { states, updateCapacitys, getDetailCapacity } = useContext(CapacityContext);
    const { register, handleSubmit, reset } = useForm<Capacity>()
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            getDetailCapacity(id!)

        })()
    }, [])
    useEffect(() => {
        reset({
            value: states.selectedCapacity?.value
        }
        )
    }, [states.selectedCapacity, reset])
    return (
        <div className="content p-4">
            <div className='card mb-4'>
                <div className='card-body'>
                    <div style={{ maxWidth: "2000px", margin: "0 auto" }}>
                        <div className='card-body p-5'>
                            <h3 className="fw-bold mb-3">Sửa Bộ Nhớ Sản phẩm</h3>
                            <p className="text-muted mb-4">Quản lý bộ nhớ sản phẩm cho cửa hàng Rivera</p>
                            <form
                                onSubmit={handleSubmit((data) => {
                                    if (!id) {
                                        console.error("ID is undefined");
                                        return;
                                    }
                                    updateCapacitys(id, data);
                                })}
                            // style={{ width: "1000px" }}
                            >
                                <div className="form-group mb-5">
                                    <label htmlFor="name" className="fw-bold fs-5">
                                        Tên màu sắc
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

export default UpdateCapacity