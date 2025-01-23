import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Category, getCategoriesById, updateCategories } from '../../../services/category'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateCategories = () => {
    const { register, handleSubmit,setValue } = useForm<Category>();
    
    const { id } = useParams();
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await getCategoriesById(id!)
            console.log(data.data);
            setValue('name', data.name);
        setValue('slug', data.slug);
        })()
    }, [])
    const onSubmit = async (category: Category) => {
        await updateCategories(id!, category);
        nav("/admin/category")
    }
  return (
    <div>
          <form onSubmit={handleSubmit(onSubmit)} >
              <div className='form-group'>
                  <label htmlFor="name">name</label>
                  <input type="text" className='form-control' {...register("name")} />
              </div>
              <div className='form-group'>
                  <label htmlFor="name">name</label>
                  <input type="text" className='form-control' {...register("slug")} />
              </div>
              <div className='form-group'>
                  <button className='btn btn-primary'>submit</button>
              </div>
      </form>
    </div>
  )
}

export default UpdateCategories
