import React, { useContext } from "react";
import { ColorContext } from "../../../context/ColorContext";
import { useForm } from "react-hook-form";
import { Color } from "../../../services/color";

const AddColor = () => {
  const { createColor } = useContext(ColorContext);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Color>()

  return (
    <div className="content">
      <div className="container  d-flex justify-content-center align-items-center mt-5">
        <div className="row justify-content-center w-100">
          <div className="col-lg-8 col-md-10">
            <div className="text-center">
              <h2 className="fw-bold text-primary">
                Thêm mới Màu sắc Sản phẩm
              </h2>
              <p className="text-muted">
                Quản lý màu sắc sản phẩm cho cửa hàng Rivera
              </p>
            </div>

            <form
              onSubmit={handleSubmit((data) => createColor(data))}
              className="p-5 border rounded shadow-sm bg-light"
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
  );
};

export default AddColor;
