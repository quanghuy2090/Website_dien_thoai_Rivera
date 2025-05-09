import React, { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Category, Product } from "../../../services/product";
import { getCategories } from "../../../services/category";
import toast from "react-hot-toast";
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductContext } from "../../../context/ProductContext";
import { CapacityContext } from "../../../context/CapacityContext";
import { ColorContext } from "../../../context/ColorContext";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from "react-router-dom";
const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự").max(225),
  images: z
    .array(z.string())
    .max(5, "Chỉ được tải lên tối đa 5 ảnh")
    .optional(),
  short_description: z.string().nonempty("Mô tả ngắn không được để trống"),
  long_description: z.string().nonempty("Mô tả chi tiết không được để trống"),
  categoryId: z.string().nonempty("Vui lòng chọn danh mục"),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, "Màu sắc không được để trống"),
        capacity: z.string().nonempty("Bộ nhớ không được để trống"),
        price: z.number().min(1, "Giá phải lớn hơn 0"),
        stock: z.number().min(0, "Số lượng phải >= 0"),
        sku: z.string().optional(),
        sale: z.number().max(100, "sale max 100%"),
      })
    )
    .min(1, "Cần ít nhất 1 biến thể"),
});
const AddProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      short_description: "",
      long_description: "",
      images: [],
      categoryId: "",
      variants: [{ color: "", capacity: "", price: 1, stock: 0, sale: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const [category, setCategory] = useState<Category[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [inputs, setInputs] = useState<number[]>([0]);
  const { createProduct } = useContext(ProductContext)
  const { states } = useContext(CapacityContext);
  const { state } = useContext(ColorContext)
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (inputFiles.length >= 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh!");
      return;
    }
    if (event.target.files) {
      const file = event.target.files[0];
      setInputFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });
      setPreviewImages((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });
    }
  };

  const addInput = () => {
    if (inputFiles.length >= 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh!");
      return;
    }
    setInputs((prev) => [...prev, prev.length]);
  };
  const removeInput = (index: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
    setInputFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const { data } = await axios.post(
      "http://localhost:3000/api/file/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.imageUrls;
  };
  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategory(data.data);
    })();
  }, []);
  const onSubmit = async (product: Product) => {
    try {
      if (inputFiles.length > 0) {
        const imageUrls = await uploadImages(inputFiles);
        product.images = imageUrls;
      }
      createProduct(product);
    } catch (err) {
      console.log(err)
    }
  };
  return (
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
            <h3 className="fw-bold mb-3">Thêm mới Sản phẩm</h3>
            <p className="text-muted mb-4">Quản lý sản phẩm cho cửa hàng Rivera</p>
            <form
              onSubmit={handleSubmit(onSubmit)}

            >
              {/* Tên sản phẩm */}
              <div className="mb-3">
                <label className="fw-bold">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>

              {/* Mô tả ngắn */}
              <div className="mb-3">
                <label className="fw-bold">Mô tả ngắn</label>
                <Controller
                  name="short_description"
                  control={control}
                  rules={{ required: 'Vui lòng nhập mô tả ngắn' }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập mô tả ngắn..."
                    />
                  )}
                />
                {errors.short_description && (
                  <p className="text-danger">{errors.short_description.message}</p>
                )}
              </div>

              {/* Mô tả dài */}
              <div className="mb-3">
                <label className="fw-bold">Mô tả chi tiết</label>
                <Controller
                  name="long_description"
                  control={control}
                  rules={{ required: 'Vui lòng nhập mô tả chi tiết' }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  )}
                />
                {errors.long_description && (
                  <p className="text-danger">{errors.long_description.message}</p>
                )}
              </div>

              {/* Ảnh sản phẩm */}
              <div className="mb-3">
                <label className="fw-bold">Ảnh sản phẩm</label>
                {inputs.map((_, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                      className="form-control"
                    />
                    {previewImages[index] && (
                      <div className="position-relative">
                        <img
                          src={previewImages[index]}
                          alt=""
                          className="img-thumbnail"
                          style={{ width: "60px", height: "60px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => removeInput(index)}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={addInput}
                >
                  + Thêm ảnh
                </button>
              </div>

              {/* Các biến thể sản phẩm */}
              {fields.map((field, index) => (
                <div key={index} className="mb-3 border p-3 rounded">
                  <h5 className="fw-bold">Biến thể {index + 1}</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-bold">Màu sắc</label>
                      <select
                        className="form-control"
                        {...register(`variants.${index}.color`)}
                      >
                        <option disabled value="">
                          Chọn màu
                        </option>

                        {state.colors.map((color) => (
                          <option key={color._id} value={color._id}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[index]?.color && (
                        <p className="text-danger">
                          {errors.variants[index]?.color?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Bộ nhớ</label>
                      <select
                        className="form-control"
                        {...register(`variants.${index}.capacity`)}
                      >
                        <option disabled value="">
                          Chọn Bộ Nhớ
                        </option>
                        {states.capacitys.map((capacity) => (
                          <option key={capacity._id} value={capacity._id}>
                            {capacity.value}
                          </option>
                        ))}
                      </select>
                      {errors.variants?.[index]?.capacity && (
                        <p className="text-danger">
                          {errors.variants[index]?.capacity?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-4">
                      <label className="fw-bold">Giá</label>
                      <input
                        type="number"
                        className="form-control"
                        {...register(`variants.${index}.price`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="tex-danger">
                          {errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="fw-bold">Giá sale</label>
                      <input
                        type="number"
                        className="form-control"
                        {...register(`variants.${index}.sale`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                      {errors.variants?.[index]?.sale && (
                        <p className="tex-danger">
                          {errors.variants[index]?.sale?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="fw-bold">Số lượng</label>
                      <input
                        type="number"
                        className="form-control"
                        {...register(`variants.${index}.stock`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                      {errors.variants?.[index]?.stock && (
                        <p className="tex-danger">
                          {errors.variants[index]?.stock?.message}
                        </p>
                      )}
                    </div>
                    {/* <div className="col-md-4">
                      <label className="fw-bold">SKU</label>
                      <input
                        type="text" disabled
                        className="form-control"
                        {...register(`variants.${index}.sku`, {
                          required: true,
                        })}
                      />
                      {errors.variants?.[index]?.sku && (
                        <p className="tex-danger">
                          {errors.variants[index]?.sku?.message}
                        </p>
                      )}
                    </div> */}
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => remove(index)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-success btn-sm mt-2"
                onClick={() =>
                  append({
                    color: "",
                    capacity: "",
                    price: 1,
                    stock: 0,
                    // sku: `SKU-${Date.now()}`,
                    sale: 0,
                  })
                }
              >
                + Thêm biến thể
              </button>

              {/* Danh mục */}
              <div className="mb-3 mt-3">
                <label className="fw-bold">Danh mục</label>
                <select
                  className="form-control"
                  {...register("categoryId", { required: true })}
                >
                  <option value="" disabled>
                    Chọn danh mục
                  </option>
                  {category.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-danger">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Nút Submit */}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  Lưu
                </button>
                <Link to={`/admin/products`} type="reset" className="btn btn-danger">
                  Hủy
                </Link>
              </div>
            </form>
          </div>


        </div>
      </div>

    </div>
  );
};

export default AddProduct;
