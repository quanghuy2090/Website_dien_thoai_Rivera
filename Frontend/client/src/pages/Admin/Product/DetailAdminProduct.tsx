import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../../../context/ProductContext";
// import toast from "react-hot-toast";
// import { updateProductStatus } from "../../../services/product";

const DetailAdminProduct = () => {
  const { id } = useParams();
  const { getDetailProduct, state, updateStatus } = useContext(ProductContext);
  // const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState(state.selectedProduct?.status || "active");
  useEffect(() => {
    getDetailProduct(id!)
  }, []);
  // const handleStatusChange = async () => {
  //   if (!id) return;

  //   try {
  //     setLoading(true);
  //     const newStatus = status === "active" ? "banned" : "active";
  //     await updateProductStatus(id, newStatus);
  //     setStatus(newStatus);
  //     toast.success(`Sản phẩm đã chuyển sang trạng thái "${newStatus}"`);
  //   } catch (error) {
  //     // toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div>
      <div className="content">
        <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
          <i className="fas fa-cart-plus me-2"></i> Chi Tiết Sản Phẩm
        </h1>
        <p className="mb-4 text-secondary">
          Đây là thông tin chi tiết của sản phẩm "
          <strong>{state.selectedProduct?.name}</strong>". Bạn có thể xem thông tin và
          quản lý sản phẩm tại đây.
        </p>

        <div className="table-container">
          <table className="table table-bordered border-primary">
            <tbody>
              <tr>
                <th>Id</th>
                <td>{state.selectedProduct?._id}</td>
              </tr>
              <tr>
                <th>Tên sp</th>
                <td>{state.selectedProduct?.name}</td>
              </tr>
              <tr>
                <th>Mô tả ngắn</th>
                <td>{state.selectedProduct?.short_description}</td>
              </tr>
              <tr>
                <th>Mô tả chi tiết</th>
                <td>{state.selectedProduct?.long_description}</td>
              </tr>
              <tr>
                <th>Trạng Thái</th>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={state.selectedProduct?.status === "active"} // Kiểm tra trạng thái hiện tại
                      onChange={() =>
                        updateStatus(
                          state.selectedProduct?._id as string,
                          state.selectedProduct?.status === "active" ? "banned" : "active"
                        )
                      }
                    />
                    <label className="form-check-label ms-2">
                      {state.selectedProduct?.status === "active" ? "Hoạt động" : "Bị cấm"}
                    </label>
                  </div>
                </td>
              </tr>


              <tr>
                <th>Danh mục</th>
                <td>
                  <td>
                    {typeof state.selectedProduct?.categoryId === "object"
                      ? state.selectedProduct.categoryId.name
                      : "Không có danh mục"}
                  </td>

                </td>
              </tr>
              <tr>
                <th>Ảnh sản phẩm</th>
                {state.selectedProduct?.images.map((image) => (
                  <img src={image} alt="" width={100} />
                ))}
              </tr>
              <tr>
                <th>Biến thể</th>
                <td>
                  <table className="table table-bordered border-primary">
                    <thead>
                      <tr>
                        <th>Màu</th>
                        <th>Giá</th>
                        <th>Bộ nhớ</th>
                        <th>Stock</th>
                        <th>Sku</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.selectedProduct?.variants.map((variant, index) => (
                        <tr key={index}>
                          <td>{variant.color && typeof variant.color === "object" ? variant.color.name : variant.color ?? "Không xác định"}</td>
                          <td>{variant.price}</td>
                          <td>{variant.capacity && typeof variant.capacity === "object" ? variant.capacity.value : variant.capacity ?? "Không xác định"}</td>
                          <td>{variant.stock}</td>
                          <td>{variant.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailAdminProduct;
