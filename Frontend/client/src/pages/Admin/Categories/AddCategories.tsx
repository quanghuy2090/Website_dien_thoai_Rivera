import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../../services/category";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryContext } from "../../../context/CategoryContext";
import { Link } from "react-router-dom";
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
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ maxWidth: "2000px", margin: "0 auto" }}>
            <h3 className="fw-bold mb-3">Thêm Mới Danh Mục Sản phẩm</h3>
            <p className="text-muted mb-4">Quản lý danh mục sản phẩm cho cửa hàng Rivera</p>
            <form
              onSubmit={handleSubmit((data) => createCategory(data))}

            >
              <div className="form-group mb-5">
                <label htmlFor="name" className="form-label fw-semibold">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  style={{ height: '60px', fontSize: '1.25rem', padding: '0.75rem 1rem' }}
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
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  Lưu
                </button>
                <Link to={`/admin/category`} type="reset" className="btn btn-danger">
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

export default AddCategories;
