import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Category, getProductById, Product } from '../../../services/product'
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../../services/category';
import { updateProduct } from './../../../services/product';
import toast from 'react-hot-toast';

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
    }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label htmlFor="name">Name</label>
          <input type="text" className='form-control'{...register("name")} />
        </div>

        <div className='form-group'>
          <label htmlFor="price">Price</label>
          <input type="number" className='form-control'{...register("price")} />
        </div>

        <div className='form-group'>
          <label htmlFor="description">Description</label>
          <input type="text" className='form-control'{...register("description")} />
        </div>

        <div className='form-group'>
          <select className='form-control'{...register("categoryId")}>
            {category.map((item) => (
               <option key={item._id} value={item._id}>
                {item.name}
              </option>
          ))}
          </select>
        </div>

        <div className='form-group'>
         <button className='btn btn-primary'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProduct
