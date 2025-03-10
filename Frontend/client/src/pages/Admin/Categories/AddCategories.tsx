import React from 'react'
import { useForm } from 'react-hook-form'
import { addCategories, Category } from '../../../services/category'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

const categorySchema = z.object({
  name: z.string().min(3).max(225),
  slug: z.string().min(3).max(225),
})
const AddCategories = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Category>({
    resolver: zodResolver(categorySchema)
  })
  const nav = useNavigate();
  const onSubmit = async (category: Category) => {
    try {
      const res = await addCategories(category)
      console.log(res.data);
      toast.success("Category added successfully")
      nav("/admin/category")
    } catch (error) {
      console.log(error)
      toast.error("Error adding categories")
    }
  }
  return (
    <div className='content'>
      <div className="container  d-flex justify-content-center align-items-center vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-lg-8 col-md-10">
            <div className="text-center">
              <h2 className="fw-bold text-primary">Thêm Danh Mục Sản Phẩm</h2>
              <p className="text-muted">Quản lý danh mục sản phẩm cho cửa hàng Rivera</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 border rounded shadow-sm bg-light"
              style={{ minHeight: "500px" }}
            >
              <div className="form-group mb-5">
                <label htmlFor="name" className="fw-bold fs-5">Tên danh mục</label>
                <input type="text" className="form-control form-control-lg" {...register("name", { required: true })} />
                {errors.name && <p className="text-danger">{errors.name.message}</p>}
              </div>
              <div className="form-group mb-5">
                <label htmlFor="slug" className="fw-bold fs-5">Mô tả</label>
                <input type="text" className="form-control form-control-lg" {...register("slug", { required: true })} />
                {errors.slug && <p className="text-danger">{errors.slug.message}</p>}
              </div>
              <div className="form-group mb-5">
                <button className="btn btn-primary w-100 py-3 fs-5">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>





  )
}

export default AddCategories
