import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Category, getCategoriesById, updateCategories } from '../../../services/category'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

const categorySchema = z.object({
    name: z.string().min(3).max(225),
    slug: z.string().min(3).max(225),
})
const UpdateCategories = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Category>({
        resolver: zodResolver(categorySchema)
    });

    const { id } = useParams();
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await getCategoriesById(id!)
            console.log(data.data);
            setValue('name', data.data.name);
            setValue('slug', data.data.slug);
            toast.success("categories id successfully")
        })()
    }, [])
    const onSubmit = async (category: Category) => {
        await updateCategories(id!, category)
        toast.success("Updated categories");
        nav("/admin/category")
    }
    return (
        <div className=' col-md-10 ms-sm-auto px-md-4 mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <div className='text-center'>
                        <h2 className="fw-bold text-primary">Update Danh Mục Sản Phẩm</h2>
                        <p className="text-muted">Quản lý danh mục sản phẩm cho cửa hàng Rivera</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-sm bg-light" style={{ minHeight: "500px" }}>
                        <div className='form-group mb-5'>
                            <label htmlFor="name" className='fw-bold fs-5'>Name</label>
                            <input type="text" className=' form-control form-control form-control-lg' {...register("name", { required: true })} />
                            {errors.name && <p className='text-danger'>{errors.name.message}</p>}
                        </div>
                        <div className='form-group mb-5'>
                            <label htmlFor="name" className='fw-bold fs-5'>Slug</label>
                            <input type="text" className='form-control form-control form-control-lg ' {...register("slug", { required: true })} />
                            {errors.slug && <p className='text-danger'>{errors.slug.message}</p>}
                        </div>
                        <div className='form-group mb-5'>
                            <button className='btn btn-primary w-100 py-3 fs-5'>submit</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default UpdateCategories
