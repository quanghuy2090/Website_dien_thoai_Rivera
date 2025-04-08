import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye, FaPen } from "react-icons/fa";
import { ProductContext } from "../../../context/ProductContext";

const ListProduct = () => {
  const { removeProducts, state, updateStatus, updateIs_Hot } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [expandedProductId, setExpandedProductId] = useState<string | null>(
  //   null
  // ); // State for expanded product

  const filteredProducts = state.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      (typeof product.categoryId === "object"
        ? product.categoryId._id === categoryFilter
        : product.categoryId === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Lấy danh sách danh mục duy nhất từ sản phẩm
  const uniqueCategories = Array.from(
    new Set(
      state.products
        .map((product) =>
          typeof product.categoryId === "object" ? JSON.stringify(product.categoryId) : null
        )
        .filter(Boolean)
    )
  ).map((catStr) => JSON.parse(catStr as string));

  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-cube me-2"></i> Quản lý Sản phẩm
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách sản phẩm trong cửa hàng. Bạn có thể quản lý, chỉnh sửa
        hoặc thêm mới sản phẩm.
      </p>

      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            {/* Hiển thị số sản phẩm */}
            <label className="d-flex align-items-center mb-0">
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

            </label>

            {/* Bộ lọc danh mục */}
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0">Danh mục:</label>
              <select
                className="form-control form-control-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ô tìm kiếm */}
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
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Hot</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice(0, itemsPerPage).map((product, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{product.name}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt="Ảnh sản phẩm"
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
                  </div>
                </td>

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
                      checked={product.status === "active"}
                      onChange={() =>
                        updateStatus(
                          product._id,
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
                      checked={product.is_hot === "yes"}
                      onChange={() =>
                        updateIs_Hot(
                          product._id,
                          product.is_hot === "yes" ? "no" : "yes"
                        )
                      }
                    />
                    <label className="form-check-label ms-2">
                      {product.is_hot === "yes" ? "🔥 Hot" : "❌ Not Hot"}
                    </label>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-danger me-2"
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
