import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Category, getProductById, Product } from '../../../services/product'
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../../services/category';
import { updateProduct } from './../../../services/product';
import toast from 'react-hot-toast';
<<<<<<< HEAD
import axios from 'axios';
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
const productSchema = z.object({
  name: z.string().min(3).max(225),
  price: z.number().min(0),
  image: z.any().refine((file) => file !== null && file !== undefined),
  description: z.string().nonempty(),
  categoryId: z.string().nonempty(),
})
const UpdateProduct = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema)
  });
  const { id } = useParams();
  const [category, setCategory] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategory(data.data);
    })()
  }, [])
  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      console.log(data);
      toast.success("Product id successfully")
      setValue("name", data.data.name);
      setValue("price", data.data.price)
      setValue("description", data.data.description);
      setImagePreview(data.data.image);
      setValue("categoryId._id", data.data.categoryId);
    })()
  }, [])
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Show image preview
      };
      reader.readAsDataURL(file);
=======

const UpdateProduct = () => {
    const { register, handleSubmit,setValue } = useForm<Product>();
    const { id } = useParams();
    const [category, setCategory] = useState<Category[]>([]);
      const nav = useNavigate();
      useEffect(() => {
          (async () => {
            const { data } = await getCategories();
              setCategory(data.data);
          })()
        }, [])
    useEffect(() => {
        (async () => {
            const { data } = await getProductById(id!);
            console.log(data);
            toast.success("Product id successfully")
            setValue("name", data.data.name);
              setValue("price", data.data.price)
              setValue("description", data.data.description);
              setValue("categoryId._id", data.data.categoryId);
        })()
    }, [])
    const onSubmit=async(product:Product)=>{
        try {
            const { data } = await updateProduct(id!, product)
            console.log(data);
            toast.success("product updated successfully")
            nav("/admin/products");
        } catch (error) {
            console.log(error)
            toast.error("Product update unsuccessful")

        }
>>>>>>> a18280db041dfbf446fd234f6c8ca20bcc24cbb0
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

        <div className='form-group'>
<<<<<<< HEAD
          <label htmlFor="image">Image</label>
          <input type="file" className='form-control'{...register("image", { required: true })} onChange={handleImageChange} />
          {errors.image && <p className='text-danger'>{errors.image.message}</p>}
          {imagePreview && <img src={imagePreview} alt="Image Preview" width="100" />}
        </div>

        <div className='form-group'>
          <select className='form-control'{...register("categoryId", { required: true })}>
=======
          <select className='form-control'{...register("categoryId")}>
>>>>>>> a18280db041dfbf446fd234f6c8ca20bcc24cbb0
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

export default UpdateProduct
