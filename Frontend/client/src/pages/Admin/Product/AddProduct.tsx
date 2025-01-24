import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addProduct, Category, Product } from '../../../services/product'
import { getCategories } from '../../../services/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { register, handleSubmit } = useForm<Product>();
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

export default AddProduct
