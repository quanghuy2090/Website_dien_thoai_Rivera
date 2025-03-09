import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  images: z.array(z.string()).max(5, "Chỉ được tải lên tối đa 5 ảnh").optional(),
  short_description: z.string().nonempty(),
  long_description: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  variants: z.array(
    z.object({
      color: z.string().min(1, "Màu sắc không được để trống"),
      capacity: z.string().optional(),
      price: z.number().min(1, "Giá phải lớn hơn 0"),
      stock: z.number().min(0, "Số lượng phải >= 0"),
      sku: z.string().min(1, "SKU không được để trống"),
    })
  ).min(1, "Cần ít nhất 1 biến thể"),
})

const UpdateProduct = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      short_description: "",
      long_description: "",
      images: [],
      categoryId: "",
      variants: [{ color: "", capacity: "", price: 1, stock: 0, sku: "" }],
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
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
      console.log(data);
      const images = Array.isArray(data.data.images) ? data.data.images.slice(0, 5) : [data.data.images];
      setImageInputs(images.map((img: string) => ({ file: null, preview: img })));
      reset({
        name: data.data.name,
        short_description: data.data.short_description,
        long_description: data.data.long_description,
        categoryId: data.data.categoryId?._id || data.data.categoryId,
        variants: data.data.variants.length > 0 ? data.data.variants : [{ color: "", capacity: "", price: 1, stock: 0, sku: "" }]
      });
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
    <div className='content'>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 ">
        <div className="row justify-content-center w-100">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="text-center mt-5">
              <h2 className="fw-bold text-primary">Cập nhật sản phẩm</h2>
              <p className="text-muted">Chỉnh sửa thông tin sản phẩm của bạn</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-white shadow">
              {/* Tên và giá sản phẩm */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="fw-bold">Tên sản phẩm</label>
                  <input type="text" className="form-control" {...register("name")} />
                  {errors.name && <p className="text-danger">{errors.name.message}</p>}
                </div>
              </div>

              {/* Mô tả */}
              <div className="mb-3">
                <label htmlFor="short_description" className="fw-bold">Mô tả sản phẩm</label>
                <textarea className="form-control"  {...register("long_description", { required: true })}></textarea>
                {errors.long_description && <p className="text-danger">{errors.long_description.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="fw-bold">Mô tả sản phẩm</label>
                <textarea className="form-control"  {...register("short_description", { required: true })}></textarea>
                {errors.short_description && <p className="text-danger">{errors.short_description.message}</p>}
              </div>

              {/* Hình ảnh */}
              <div className="mb-3">
                <label className="fw-bold">Hình ảnh</label>
                {imageInputs.map((img, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input type="file" className="form-control" onChange={(e) => handleImageChange(e, index)} />
                    {img.preview && (
                      <div className="ms-2 position-relative">
                        <img src={img.preview} alt="Preview" className="border rounded" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                        <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => removeInput(index)}>X</button>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-outline-primary mt-2" onClick={addInput}>+ Thêm ảnh</button>
              </div>

              {/* Stock và màu sắc */}
              {fields.map((field, index) => (
                <div key={index} className="mb-3 border p-3 rounded">
                  <h5 className="fw-bold">Biến thể {index + 1}</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-bold">Màu sắc</label>
                      <input type="text" className="form-control" {...register(`variants.${index}.color`, { required: true })} />
                      {errors.variants?.[index]?.color && <p>{errors.variants[index]?.color?.message}</p>}
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Dung lượng</label>
                      <input type="text" className="form-control" {...register(`variants.${index}.capacity`)} />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-4">
                      <label className="fw-bold">Giá</label>
                      <input type="number" className="form-control" {...register(`variants.${index}.price`, { required: true, valueAsNumber: true })} />
                      {errors.variants?.[index]?.price && <p>{errors.variants[index]?.price?.message}</p>}

                    </div>
                    <div className="col-md-4">
                      <label className="fw-bold">Stock</label>
                      <input type="number" className="form-control" {...register(`variants.${index}.stock`, { required: true, valueAsNumber: true })} />
                      {errors.variants?.[index]?.stock && <p>{errors.variants[index]?.stock?.message}</p>}
                    </div>
                    <div className="col-md-4">
                      <label className="fw-bold">SKU</label>
                      <input type="text" className="form-control" {...register(`variants.${index}.sku`, { required: true })} />
                      {errors.variants?.[index]?.sku && <p>{errors.variants[index]?.sku?.message}</p>}
                    </div>
                  </div>

                  <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => remove(index)}>Xóa</button>
                </div>
              ))}
              <button type="button" className="btn btn-success btn-sm mt-2" onClick={() => append({ color: "", capacity: "", price: 1, stock: 0, sku: "" })}>+ Thêm biến thể</button>

              {/* Danh mục */}
              <div className="mb-3">
                <label htmlFor="categoryId" className="fw-bold">Danh mục</label>
                <select className="form-control" {...register("categoryId", { required: true })}>
                  {category.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-danger">{errors.categoryId.message}</p>}
              </div>

              {/* Nút submit */}
              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary w-100 py-2">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>



  );
};

export default UpdateProduct;
