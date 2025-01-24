import React from 'react'
import { useForm } from 'react-hook-form'
import { addCategories, Category } from '../../../services/category'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


const AddCategories = () => {
  const { register, handleSubmit } = useForm<Category>()
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className='form-group'>
          <label htmlFor="name">name</label>
          <input type="text" className='form-control' {...register("name")} />
        </div>
         <div className='form-group'>
          <label htmlFor="slug">slug</label>
          <input type="text" className='form-control' {...register("slug")} />
        </div>
         <div className='form-group'>
          <button className='btn btn-primary w-100'>submit</button>
          
        </div>
      </form>
    </div>
  )
}

export default AddCategories
