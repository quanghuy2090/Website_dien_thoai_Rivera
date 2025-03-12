import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { addProduct, Category, Product } from "../../../services/product";
import { getCategories } from "../../../services/category";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
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
        sku: z.string().min(1, "SKU không được để trống"),
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
      variants: [{ color: "", capacity: "", price: 1, stock: 0, sku: "" }],
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
  const nav = useNavigate();

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
      const { data } = await addProduct(product);
      Swal.fire({
        title: "Thành công",
        text: "Thêm sản phẩm thành công",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        nav("/admin/products");
      });
      console.log(data);
      
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("SKU")) {
          Swal.fire({
            title: "Lỗi",
            text: "SKU đã tồn tại",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Lỗi",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        return;
      }

      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra, vui lòng thử lại",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="content">
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="row justify-content-center w-100">
          <div className="col-lg-6 col-md-8">
            {" "}
            {/* Giới hạn chiều rộng */}
            <div className="text-center">
              <h2 className="fw-bold text-primary">Thêm mới Sản phẩm</h2>
              <p className="text-muted">Quản lý sản phẩm cho cửa hàng Rivera</p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-5 border rounded shadow-sm bg-light"
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
                <textarea
                  className="form-control"
                  rows={2}
                  {...register("short_description", { required: true })}
                />
                {errors.short_description && (
                  <p className="text-danger">
                    {errors.short_description.message}
                  </p>
                )}
              </div>

              {/* Mô tả dài */}
              <div className="mb-3">
                <label className="fw-bold">Mô tả chi tiết</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register("long_description", { required: true })}
                />
                {errors.long_description && (
                  <p className="text-danger">
                    {errors.long_description.message}
                  </p>
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
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Green">Green</option>
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
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB</option>
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
                      <label className="fw-bold">Stock</label>
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
                    <div className="col-md-4">
                      <label className="fw-bold">SKU</label>
                      <input
                        type="text"
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
                    </div>
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
                    sku: "",
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
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fs-5"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
