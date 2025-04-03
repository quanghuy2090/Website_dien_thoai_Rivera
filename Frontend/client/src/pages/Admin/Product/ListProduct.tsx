import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { ProductContext } from "../../../context/ProductContext";
const ListProduct = () => {
  const { removeProducts, state, updateStatus, updateIs_Hot } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredProducts = state.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };
  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-cube me-2"></i> Quản lý Sản phẩm
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách sản phẩm trong cửa hàng. Bạn có thể quản lý, chỉnh sửa
        hoặc thêm mới sản phẩm.
      </p>
      {/* Bảng danh sách sản phẩm */}
      <div className="table-container">
        {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Phần chọn số lượng hiển thị */}
          <div>
            <label className="d-flex align-items-center">
              Hiển thị
              <select className="custom-select custom-select-sm form-control form-control-sm w-auto mx-2" value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
              mục
            </label>
          </div>

          <div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Link to={`/admin/products/add`} className="btn btn-primary mb-3 w-100">
          <IoMdAdd />
        </Link>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Stt</th>
              <th>Tên sp</th>
              {/* <th>Mô tả ngắn</th>
              <th>Mô tả chi tiết</th> */}
              <th>Ảnh</th>
              <th>Biến thể</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Hot</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice(0, itemsPerPage).map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                {/* <td>{product.short_description}</td>
                <td>{product.long_description}</td> */}
                {/* Hiển thị ảnh sản phẩm */}
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      flexWrap: "wrap",
                    }}
                  >
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product ${index}`}
                        className="rounded shadow-sm"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          transition: "transform 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    ))}
                  </div>
                </td>

                <td>
                  <table className="table table-bordered table-sm text-center">
                    <thead>
                      <tr className="bg-light">
                        <th>Bộ nhớ</th>
                        <th>Màu sắc</th>
                        <th>Giá</th>
                        <th>Sale</th>
                        <th>Giá Sale</th>
                        <th>Stock</th>
                        <th>SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((v, index) => (
                        <tr key={index}>
                          <td>{v.color && typeof v.color === "object" ? v.color.name : v.color ?? "Không xác định"}</td>
                          <td>{v.capacity && typeof v.capacity === "object" ? v.capacity.value : v.capacity ?? "Không xác định"}</td>
                          <td>{formatPrice(v.price)}</td>
                          <td className="badge bg-danger">{v.sale}%</td>
                          <td className="text-warning fw-bold">{formatPrice(v.salePrice)}</td>
                          <td>{v.stock}</td>
                          <td>{v.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

                {/* Hiển thị danh mục sản phẩm */}
                <td>
                  {typeof product.categoryId === "object" &&
                    product.categoryId !== null
                    ? product.categoryId.name
                    : product.categoryId}
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={product.status === "active"} // Sử dụng product.status thay vì state.selectedProduct
                      onChange={() =>
                        updateStatus(
                          product._id, // Cập nhật sản phẩm dựa trên _id của product
                          product.status === "active" ? "banned" : "active"
                        )
                      }
                    />
                    <label className="form-check-label ms-2">
                      {product.status === "active" ? "Hoạt động" : "Bị cấm"}
                    </label>
                  </div>
                </td>

                <td>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      role="switch"
                      checked={product.is_hot === "yes"} // Sử dụng product.is_hot
                      onChange={() =>
                        updateIs_Hot(
                          product._id, // Cập nhật sản phẩm dựa trên _id của product
                          product.is_hot === "yes" ? "no" : "yes"
                        )
                      }
                    />
                    <label className="form-check-label ms-2">
                      {product.is_hot === "yes" ? "🔥 Hot" : "❌ Not Hot"}
                    </label>
                  </div>
                </td>



                {/* Nút hành động */}
                <td>
                  <button
                    className="btn btn-danger me-2 "
                    onClick={() => removeProducts(product._id)}
                  >
                    <MdDelete />
                  </button>
                  <Link
                    to={`/admin/products/update/${product._id}`}
                    className="btn btn-warning me-2"
                  >
                    <FaPen />
                  </Link>
                  <Link
                    to={`/admin/products/detail/${product._id}`}
                    className="btn btn-info me-2"
                  >
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
