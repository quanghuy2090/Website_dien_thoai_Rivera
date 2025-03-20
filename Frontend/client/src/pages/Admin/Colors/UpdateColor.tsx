import React, { useContext, useEffect } from 'react'
import { ColorContext } from '../../../context/ColorContext';
import { useForm } from 'react-hook-form';
import { Color } from '../../../services/color';
import { useParams } from 'react-router-dom';

const UpdateColor = () => {
    const { state, updateColor, getDetailColor } = useContext(ColorContext);
    const { register, handleSubmit, reset } = useForm<Color>()
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            getDetailColor(id!)

        })()
    }, [])
    useEffect(() => {
        reset({
            name: state.selectedColor?.name
        }, { keepDefaultValues: true }
        )
    }, [state.selectedColor, reset])
    return (
        <div className="content">
            <div className="container  d-flex justify-content-center align-items-center mt-5">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-8 col-md-10">
                        <div className="text-center">
                            <h2 className="fw-bold text-primary">
                                Cập nhật Màu sắc Sản Phẩm
                            </h2>
                            <p className="text-muted">
                                Quản lý màu sắc sản phẩm cho cửa hàng Rivera
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit((data) => {
                                if (!id) {
                                    console.error("ID is undefined");
                                    return;
                                }
                                updateColor(id, data);
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
                                    {...register("name")}
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

export default UpdateColor