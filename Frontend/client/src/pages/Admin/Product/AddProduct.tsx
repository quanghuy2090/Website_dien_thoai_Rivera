import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addProduct, Category, Product } from '../../../services/product'
import { getCategories } from '../../../services/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
=======

>>>>>>> a18280db041dfbf446fd234f6c8ca20bcc24cbb0
const AddProduct = () => {
  const productSchema = z.object({
    name: z.string().min(3).max(225),
    price: z.number().min(0),
    image: z.any().refine((file) => file !== null && file !== undefined),
    description: z.string().nonempty(),
    categoryId: z.string().nonempty(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema)
  });
  const [category, setCategory] = useState<Category[]>([]);
  const nav = useNavigate();
  useEffect(() => {
      (async () => {
        const { data } = await getCategories();
        setCategory(data.data);
      })()
    }, [])
  const onSubmit = async (product: Product) => {
    try {
      const { data } = await addProduct(product);
    toast.success("Product added successfully");
      console.log(data);
      nav("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Product added failed")
    }
    
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label htmlFor="name">Name</label>
          <input type="text" className='form-control'{...register("name", { required: true })} />
          {errors.name && <p className='text-danger'>{errors.name.message}</p>}
        </div>

        <div className='form-group'>
          <label htmlFor="price">Price</label>
          <input type="number" className='form-control'{...register("price", { required: true, valueAsNumber: true })} />
          {errors.price && <p className='text-danger'>{errors.price.message}</p>}
        </div>

        <div className='form-group'>
          <label htmlFor="description">Description</label>
          <input type="text" className='form-control'{...register("description", { required: true })} />
          {errors.description && <p className='text-danger'>{errors.description.message}</p>}
        </div>

<<<<<<< HEAD
        <div>
          <label htmlFor="image">Image</label>
          <input type="file" className='form-control'{...register("image", { required: true })} onChange={handleImageChange} />
          {errors.image && <p className='text-danger'>{errors.image.message}</p>}
          {imagePreview && <img src={imagePreview} alt="Image Preview" width="150" />}

        </div>
=======
>>>>>>> a18280db041dfbf446fd234f6c8ca20bcc24cbb0
        <div className='form-group'>
          <label htmlFor="categories">Categories</label>
          <select className='form-control'{...register("categoryId", { required: true })}>
            {category.map((item) => (
               <option key={item._id} value={item._id}>
                {item.name}
              </option>
          ))}
          </select>
          {errors.categoryId && <p className='text-danger'>{errors.categoryId.message}</p>}
        </div>

        <div className='form-group'>
         <button className='btn btn-primary'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
