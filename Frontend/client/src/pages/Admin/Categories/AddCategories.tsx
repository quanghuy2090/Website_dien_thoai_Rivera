import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../../services/category";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryContext } from "../../../context/CategoryContext";
const categorySchema = z.object({
  name: z.string().min(3).max(225),
  // slug: z.string().min(3).max(225),
});
const AddCategories = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
  });

  const { createCategory } = useContext(CategoryContext);
  return (
    <div className="content">
      <div className="container  d-flex justify-content-center align-items-center mt-5">
        <div className="row justify-content-center w-100">
          <div className="col-lg-12 col-md-12">
            <div className="text-center">
              <h2 className="fw-bold text-primary">
                Thêm mới Danh mục Sản phẩm
              </h2>
              <p className="text-muted">
                Quản lý danh mục sản phẩm cho cửa hàng Rivera
              </p>
            </div>

            <form
              onSubmit={handleSubmit((data) => createCategory(data))}
              className="p-5 border rounded shadow-sm bg-light"
            >
              <div className="form-group mb-5">
                <label htmlFor="name" className="fw-bold fs-5">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>
              {/* <div className="form-group mb-5">
                <label htmlFor="slug" className="fw-bold fs-5">
                  Mô tả
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  {...register("slug", { required: true })}
                />
                {errors.slug && (
                  <p className="text-danger">{errors.slug.message}</p>
                )}
              </div> */}
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

export default AddCategories;
