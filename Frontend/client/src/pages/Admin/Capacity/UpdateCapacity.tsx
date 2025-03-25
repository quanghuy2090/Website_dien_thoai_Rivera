import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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
        <div className="content">
            <div className="container  d-flex justify-content-center align-items-center mt-5">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-12 col-md-12">
                        <div className="text-center">
                            <h2 className="fw-bold text-primary">
                                Cập nhật Bộ nhớ  Sản Phẩm
                            </h2>
                            <p className="text-muted">
                                Quản lý bộ nhớ sản phẩm cho cửa hàng Rivera
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit((data) => {
                                if (!id) {
                                    console.error("ID is undefined");
                                    return;
                                }
                                updateCapacitys(id, data);
                            })}

                            className="p-5 border rounded shadow-sm bg-light"
                        // style={{ width: "1000px" }}
                        >
                            <div className="form-group mb-5">
                                <label htmlFor="name" className="fw-bold fs-5">
                                    Tên màu sắc
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

export default UpdateCapacity