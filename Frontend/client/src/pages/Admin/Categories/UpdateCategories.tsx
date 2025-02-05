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
            toast.success("product id successfully")
        })()
    }, [])
    const onSubmit = async (category: Category) => {
        await updateCategories(id!, category)
        toast.success("Updated categories");
        nav("/admin/category")
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className='form-group'>
                    <label htmlFor="name">name</label>
                    <input type="text" className='form-control' {...register("name", { required: true })} />
                    {errors.name && <p className='text-danger'>{errors.name.message}</p>}
                </div>
                <div className='form-group'>
                    <label htmlFor="name">slug</label>
                    <input type="text" className='form-control' {...register("slug", { required: true })} />
                    {errors.slug && <p className='text-danger'>{errors.slug.message}</p>}
                </div>
                <div className='form-group'>
                    <button className='btn btn-primary'>submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateCategories
