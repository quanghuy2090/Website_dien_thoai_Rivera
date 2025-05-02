import React, { useContext } from "react";
import { ColorContext } from "../../../context/ColorContext";
import { useForm } from "react-hook-form";
import { Color } from "../../../services/color";
import { Link } from "react-router-dom";

const AddColor = () => {
  const { createColor } = useContext(ColorContext);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Color>()

  return (
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ maxWidth: "2000px", margin: "0 auto" }}>
            <h3 className="fw-bold mb-3">Thêm Mới Màu Sắc Sản phẩm</h3>
            <p className="text-muted mb-4">Quản lý màu sắc sản phẩm cho cửa hàng Rivera</p>
            <form
              onSubmit={handleSubmit((data) => createColor(data))}
            >
              <div className="form-group mb-5">
                <label htmlFor="name" className="form-label fw-semibold">
                  Tên màu sắc
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  style={{ height: '60px', fontSize: '1.25rem', padding: '0.75rem 1rem' }}
                  {...register("name")}
                />

              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  Lưu
                </button>
                <Link to={`/admin/color`} type="reset" className="btn btn-danger">
                  Hủy
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AddColor;
