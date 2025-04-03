import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye, FaPen } from "react-icons/fa";
import { ProductContext } from "../../../context/ProductContext";

const ListProduct = () => {
  const { removeProducts, state } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  ); // State for expanded product

  const filteredProducts = state.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const toggleVariants = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId)); // Toggle the variant visibility
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="d-flex align-items-center">
              Hiển thị
              <select
                className="custom-select custom-select-sm form-control form-control-sm w-auto mx-2"
                value={itemsPerPage}
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
              <React.Fragment key={product._id}>
                <tr>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">{product.name}</td>
                  <td className="align-middle">
                    <img
                      src={product.images[0]}
                      className="rounded shadow-sm"
                      alt={`Product ${index}`}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease", // Add transition for smooth effect
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </td>
                  <td className="align-middle">
                    <button
                      className="btn-variant"
                      onClick={() => toggleVariants(product._id)}
                    >
                      {expandedProductId === product._id
                        ? "Ẩn biến thể"
                        : "Xem biến thể"}
                    </button>
                  </td>
                  <td className="align-middle">{product.categoryId?.name || "Không xác định"}</td>
                  <td className="align-middle">{product.status}</td>
                  <td className="align-middle">{product.is_hot}</td>
                  <td className="align-middle">
                    {/* <button
                      className="btn btn-danger me-2"
                      onClick={() => removeProducts(product._id)}
                    >
                      <MdDelete />
                    </button> */}
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
                {expandedProductId === product._id && (
                  <tr>
                    <td colSpan={8}>
                      <table className="table table-bordered table-sm text-center">
                        <thead>
                          <tr className="bg-light">
                            <th>Màu sắc</th>
                            <th>Bộ nhớ</th>
                            {/* <th>Giá</th> */}
                            <th>Kho</th>
                            <th>SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.variants.map((v, idx) => (
                            <tr key={idx}>
                              <td>
                                {v.color?.name || v.color || "Không xác định"}
                              </td>
                              <td>
                                {v.capacity?.value ||
                                  v.capacity ||
                                  "Không xác định"}
                              </td>
                              {/* <td className="text-warning fw-bold">{formatPrice(v.salePrice)}</td> */}
                              <td>{v.stock}</td>
                              <td>{v.sku}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
