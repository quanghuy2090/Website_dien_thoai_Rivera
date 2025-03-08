import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Category, getProductById, Product } from '../../../services/product';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../../services/category';
import { updateProduct } from '../../../services/product';
import toast from 'react-hot-toast';
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const productSchema = z.object({
  name: z.string().min(3).max(225),
  price: z.number().min(0),
  images: z.array(z.string()).max(5, "Chỉ được tải lên tối đa 5 ảnh").optional(),
  stock: z.number().min(0),
  color: z.string().nonempty(),
  description: z.string().nonempty(),
  categoryId: z.string().nonempty(),
});

const UpdateProduct = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema)
  });

  const { id } = useParams();
  const [category, setCategory] = useState<Category[]>([]);
  const [imageInputs, setImageInputs] = useState<{ file: File | null; preview: string }[]>([{ file: null, preview: "" }]);
  const nav = useNavigate();

  // Xử lý khi chọn ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setImageInputs(prev => {
        const newInputs = [...prev];
        newInputs[index] = { file, preview: imageUrl }; // Cập nhật đúng vị trí
        return newInputs;
      });
    }
  };

  // Thêm input mới
  const addInput = () => {
    if (imageInputs.length >= 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh!");
      return;
    }
    setImageInputs(prev => [...prev, { file: null, preview: "" }]);
  };

  // Xóa ảnh theo index
  const removeInput = (index: number) => {
    setImageInputs(prev => prev.filter((_, i) => i !== index));
  };

  // Upload ảnh lên server
  const uploadImages = async (files: (File | null)[]) => {
    const formData = new FormData();
    files.forEach(file => {
      if (file) formData.append("images", file);
    });

    const { data } = await axios.post("http://localhost:3000/api/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return data.imageUrls;
  };

  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategory(data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      const images = Array.isArray(data.data.images) ? data.data.images.slice(0, 5) : [data.data.images];
      setImageInputs(images.map((img: string) => ({ file: null, preview: img })));
      setValue("name", data.data.name);
      setValue("price", data.data.price);
      setValue("stock", data.data.stock);
      setValue("color", data.data.color);
      setValue("description", data.data.description);

      setValue("categoryId", typeof data.data.categoryId === "string" ? data.data.categoryId : data.data.categoryId?._id);
    })();
  }, []);

  const onSubmit = async (product: Product) => {
    try {
      let imageUrls = imageInputs.map(img => img.preview); // Lấy danh sách ảnh hiện có

      // Upload ảnh mới nếu có
      const newFiles = imageInputs.map(img => img.file).filter(file => file !== null);
      if (newFiles.length > 0) {
        const uploadedUrls = await uploadImages(newFiles);

        // **Giữ thứ tự cũ, thay thế ảnh mới vào đúng vị trí**
        imageUrls = imageInputs.map(img => img.file ? uploadedUrls.shift() || img.preview : img.preview);
      }

      product.images = imageUrls; // Gán danh sách ảnh đã cập nhật
      await updateProduct(id!, product);
      toast.success("Product updated successfully");
      nav("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Product update unsuccessful");
    }
  };


  return (
    <div className='col-md-10 ms-sm-auto px-md-4 mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-8'>
          <div className='text-center'>
            <h2 className="fw-bold text-primary">Update Sản Phẩm</h2>
            <p className="text-muted">Quản lý sản phẩm cho cửa hàng Rivera</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-white shadow-sm">
            <div className="row">
              <div className='col-md-6 mb-3'>
                <label htmlFor="name" className='fw-bold fs-6'>Name</label>
                <input type="text" className='form-control' {...register("name")} />
                {errors.name && <p className='text-danger'>{errors.name.message}</p>}
              </div>

              <div className='col-md-6 mb-3'>
                <label htmlFor="price" className='fw-bold fs-6'>Price</label>
                <input type="number" className='form-control' {...register("price", { valueAsNumber: true })} />
                {errors.price && <p className='text-danger'>{errors.price.message}</p>}
              </div>
            </div>

            <div className='mb-3'>
              <label htmlFor="description" className='fw-bold fs-6'>Description</label>
              <textarea className='form-control' {...register("description", { required: true })} />
              {errors.description && <p className='text-danger'>{errors.description.message}</p>}
            </div>

            <div className='mb-3'>
              <label htmlFor="images" className='fw-bold fs-6'>Images</label>
              {imageInputs.map((img, index) => (
                <div key={index} className='d-flex align-items-center mb-2'>
                  <input type="file" onChange={(e) => handleImageChange(e, index)} className='form-control' />
                  {img.preview && (
                    <div className='ms-2 position-relative'>
                      <img src={img.preview} alt="Preview" style={{ width: "50px", height: "50px", borderRadius: "5px", border: "1px solid #ddd" }} />
                      <button type='button' className='btn btn-danger btn-sm ms-2' onClick={() => removeInput(index)}>X</button>
                    </div>
                  )}
                </div>
              ))}
              <button type='button' className='btn btn-outline-primary mt-2' onClick={addInput}>+ Thêm ảnh</button>
            </div>

            <div className="row">
              <div className='col-md-6 mb-3'>
                <label htmlFor="stock" className='fw-bold fs-6'>Stock</label>
                <input type="number" className='form-control' {...register("stock", { required: true, valueAsNumber: true })} />
                {errors.stock && <p className='text-danger'>{errors.stock.message}</p>}
              </div>

              <div className='col-md-6 mb-3'>
                <label htmlFor="color" className='fw-bold fs-6'>Color</label>
                <input type="text" className='form-control' {...register("color", { required: true })} />
                {errors.color && <p className='text-danger'>{errors.color.message}</p>}
              </div>
            </div>

            <div className='mb-3'>
              <label htmlFor="categoryId" className='fw-bold fs-6'>Categories</label>
              <select className='form-control' {...register("categoryId", { required: true })}>
                {category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className='text-danger'>{errors.categoryId.message}</p>}
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn btn-primary w-100 py-3 fs-5">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default UpdateProduct;
