import React, { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Category,
  getProductById,
  Product,
  Variants,
} from "../../../services/product";
import { Link, useParams } from "react-router-dom";
import { getCategories } from "../../../services/category";
import toast from "react-hot-toast";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ProductContext } from "../../../context/ProductContext";
import { ColorContext } from "../../../context/ColorContext";
import { CapacityContext } from "../../../context/CapacityContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const productSchema = z.object({
  name: z
    .string()
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
    .max(225)
    .optional(),
  images: z
    .array(z.string())
    .max(5, "Chỉ được tải lên tối đa 5 ảnh")
    .optional(),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  categoryId: z.string().optional(),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, "Màu sắc không được để trống"),
        capacity: z.string().nonempty("Bộ nhớ không được để trống"),
        price: z.number().min(1, "Giá phải lớn hơn 0"),
        stock: z.number().min(0, "Số lượng phải >= 0"),
        sale: z.number().max(100, "sale max 100%").default(0),
      })
    )
    .min(1, "Cần ít nhất 1 biến thể"),
});

const UpdateProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const { id } = useParams();
  const [category, setCategory] = useState<Category[]>([]);
  const [imageInputs, setImageInputs] = useState<
    { file: File | null; preview: string }[]
  >([{ file: null, preview: "" }]);
  const { updateProducts } = useContext(ProductContext);
  const { states } = useContext(CapacityContext);
  const { state } = useContext(ColorContext);

  // Xử lý khi chọn ảnh
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setImageInputs((prev) => {
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
    setImageInputs((prev) => [...prev, { file: null, preview: "" }]);
  };

  // Xóa ảnh theo index
  const removeInput = (index: number) => {
    setImageInputs((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload ảnh lên server
  const uploadImages = async (files: (File | null)[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      if (file) formData.append("images", file);
    });

    const { data } = await axios.post(
      "http://localhost:3000/api/file/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
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

  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      toast.success("Lấy chi tiết sản phẩm thành công!");
      const images = Array.isArray(data.data.images)
        ? data.data.images.slice(0, 5)
        : [data.data.images];
      setImageInputs(
        images.map((img: string) => ({ file: null, preview: img }))
      );
      reset({
        name: data.data.name,
        short_description: data.data.short_description,
        long_description: data.data.long_description,
        categoryId: data.data.categoryId?._id || data.data.categoryId,
        variants:
          data.data.variants.length > 0
            ? data.data.variants.map((v: Variants) => ({
                ...v,
                color: typeof v.color === "object" ? v.color._id : v.color,
                capacity:
                  typeof v.capacity === "object" ? v.capacity._id : v.capacity,
                sku: v.sku && v.sku !== "null" ? v.sku : `SKU-${Date.now()}`,
                isExisting: true,
              }))
            : [
                {
                  color: "",
                  capacity: "",
                  price: 1,
                  stock: 0,
                  sale: 0,
                  isExisting: false,
                },
              ],
      });
    })();
  }, [id, reset]);

  const onSubmit = async (product: Product) => {
    try {
      let imageUrls = imageInputs.map((img) => img.preview);

      // Upload ảnh mới nếu có
      const newFiles = imageInputs
        .map((img) => img.file)
        .filter((file) => file !== null);
      if (newFiles.length > 0) {
        const uploadedUrls = await uploadImages(newFiles);
        imageUrls = imageInputs.map((img) =>
          img.file ? uploadedUrls.shift() || img.preview : img.preview
        );
      }

      // Chỉ gửi các trường đã thay đổi
      const updateData: Partial<Product> = {
        ...(product.name && { name: product.name }),
        ...(imageUrls.length > 0 && { images: imageUrls }),
        ...(product.short_description && {
          short_description: product.short_description,
        }),
        ...(product.long_description && {
          long_description: product.long_description,
        }),
        ...(product.categoryId && { categoryId: product.categoryId }),
        variants: product.variants.map((variant) => ({
          color: variant.color,
          capacity: variant.capacity,
          price: variant.price,
          stock: variant.stock,
          sale: variant.sale || 0,
        })),
      };

      await updateProducts(id!, updateData as Product);
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
      }
    }
  };
  // const modules = {
  //   toolbar: [
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Cho phép chọn heading từ H1 đến H6
  //     ['bold', 'italic', 'underline'],
  //     ['link', 'image'],
  //     ['clean'] // Xóa định dạng
  //   ],
  // };
  return (
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
            <h3 className="fw-bold mb-3">Sửa Sản phẩm</h3>
            <p className="text-muted mb-4">
              Quản lý sản phẩm cho cửa hàng Rivera
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Tên và giá sản phẩm */}

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

              <div className="mb-3">
                <label className="fw-bold">Mô tả ngắn</label>
                <Controller
                  name="short_description"
                  control={control}
                  rules={{ required: "Vui lòng nhập mô tả ngắn" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      // modules={modules} // Thêm cấu hình toolbar
                      placeholder="Nhập mô tả ngắn về sản phẩm này..."
                    />
                  )}
                />
                {errors.short_description && (
                  <p className="text-danger">
                    {errors.short_description.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="fw-bold">Mô tả chi tiết</label>
                <Controller
                  name="long_description"
                  control={control}
                  rules={{ required: "Vui lòng nhập mô tả chi tiết" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      // modules={modules} // Thêm cấu hình toolbar
                      placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    />
                  )}
                />
                {errors.long_description && (
                  <p className="text-danger">
                    {errors.long_description.message}
                  </p>
                )}
              </div>

              {/* Hình ảnh */}
              <div className="mb-3">
                <label className="fw-bold">Ảnh sản phẩm</label>
                {imageInputs.map((img, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    {img.preview && (
                      <div className="ms-2 position-relative">
                        <img
                          src={img.preview}
                          alt="Preview"
                          className="border rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
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
                  className="btn btn-outline-primary mt-2"
                  onClick={addInput}
                >
                  + Thêm ảnh
                </button>
              </div>

              {/* Stock và màu sắc */}
              {fields.map((field, index) => (
                <div key={index} className="mb-3 border p-3 rounded">
                  <h5 className="fw-bold">Biến thể {index + 1}</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-bold">Màu sắc</label>
                      <select
                        className="form-control"
                        {...register(`variants.${index}.color`)}
                        disabled={field.isExisting}
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
                        <p className="tex-danger">
                          {errors.variants[index]?.color?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Bộ nhớ</label>
                      <select
                        className="form-control"
                        {...register(`variants.${index}.capacity`)}
                        disabled={field.isExisting}
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
                        <p className="tex-danger">
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
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => {
                      remove(index);
                      toast.success("Đã xóa biến thể thành công!");
                    }}
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
                    sale: 0,
                  })
                }
              >
                + Thêm biến thể
              </button>

              {/* Danh mục */}
              <div className="mb-3">
                <label htmlFor="categoryId" className="fw-bold">
                  Danh mục
                </label>
                <select
                  className="form-control"
                  {...register("categoryId", { required: true })}
                >
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

              {/* Nút submit */}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  Lưu
                </button>
                <Link
                  to={`/admin/products`}
                  type="reset"
                  className="btn btn-danger"
                >
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

export default UpdateProduct;
