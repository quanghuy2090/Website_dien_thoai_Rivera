import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../../../context/ProductContext";

const DetailAdminProduct = () => {
  const { id } = useParams();
  const { getDetailProduct, state } = useContext(ProductContext);
  useEffect(() => {
    getDetailProduct(id!)
  }, [])
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
