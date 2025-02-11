import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addProduct, Category, Product } from '../../../services/product'
import { getCategories } from '../../../services/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
const productSchema = z.object({
  name: z.string().min(3).max(225),
  price: z.number().min(0),
  images: z.array(z.string()).max(5, "Chỉ được tải lên tối đa 5 ảnh").optional(),
  stock: z.number().min(0),
  color: z.string().nonempty(),
  description: z.string().nonempty(),
  categoryId: z.string().nonempty(),
})
const AddProduct = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema)
  });
  const [category, setCategory] = useState<Category[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [inputs, setInputs] = useState<number[]>([0]);
  const nav = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (inputFiles.length >= 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh!");
      return;
    }
    if (event.target.files) {
      const file = event.target.files[0];
      setInputFiles(prev => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });
      setPreviewImages(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      })
    }
  };

  const addInput = () => {
    if (inputFiles.length >= 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh!");
      return;
    }
    setInputs(prev => [...prev, prev.length]);
  };
  const removeInput = (index: number) => {
    setInputs(prev => prev.filter((_, i) => i !== index));
    setInputFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    const { data } = await axios.post("http://localhost:3000/api/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data.imageUrls;
  }
  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategory(data.data);
    })()
  }, []);
  const onSubmit = async (product: Product) => {
    try {
      if (inputFiles.length > 0) {
        const imageUrls = await uploadImages(inputFiles);
        product.images = imageUrls;
      }
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
    <div className='col-md-10 ms-sm-auto px-md-4'>
      <div className='row justify-content-center'>

        <div className='col-md-8'>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-sm bg-light">
            <div className='form-group'>
              <label htmlFor="name">Name</label>
              <input type="text" className='form-control border-primary shadow-sm'{...register("name", { required: true })} />
              {errors.name && <p className='text-danger'>{errors.name.message}</p>}
            </div>

            <div className='form-group'>
              <label htmlFor="price">Price</label>
              <input type="number" className='form-control border-primary shadow-sm'{...register("price", { required: true, valueAsNumber: true })} />
              {errors.price && <p className='text-danger'>{errors.price.message}</p>}
            </div>

            <div className='form-group'>
              <label htmlFor="description">Description</label>
              <textarea className='form-control border-primary shadow-sm'{...register("description", { required: true })} />
              {errors.description && <p className='text-danger'>{errors.description.message}</p>}
            </div>

            <div className='form-group'>
              <label htmlFor="images">Images</label>
              {inputs.map((_, index) => (
                <div key={index} className='relative'>
                  <input type="file" onChange={(e) => handleImageChange(e, index)} className='form-control border-primary shadow-sm' />
                  {previewImages[index] && (
                    <div className='mt-2 relative'>
                      <img src={previewImages[index]} alt="" style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ddd"
                      }} />
                      <button type="button" className="btn btn-danger " onClick={() => removeInput(index)}>X</button>
                    </div>
                  )}
                </div>
              ))}

              <button type='button' className='btn btn-outline-primary mt-2' onClick={addInput}>+ thêm ảnh</button>
            </div>

            <div className='form-group'>
              <label htmlFor="stock">Stock</label>
              <input type="number" className='form-control border-primary shadow-sm'{...register("stock", { required: true, valueAsNumber: true })} />
              {errors.stock && <p className='text-danger'>{errors.stock.message}</p>}
            </div>

            <div className='form-group'>
              <label htmlFor="color">Color</label>
              <input type="text" className='form-control border-primary shadow-sm'{...register("color", { required: true })} />
              {errors.color && <p className='text-danger'>{errors.color.message}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor="categoryId">Categories</label>
              <select className='form-control border-primary shadow-sm'{...register("categoryId", { required: true })}>
                {category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className='text-danger'>{errors.categoryId.message}</p>}
            </div>

            <div className="text-center mt-2">
              <button type="submit" className="btn btn-primary px-4 w-100">Submit</button>
            </div>
          </form>
        </div>
      </div>


    </div>
  )
}

export default AddProduct