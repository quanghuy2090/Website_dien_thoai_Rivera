import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { CategoryContext } from "../../../context/CategoryContext";

const ListCategories = () => {
  const { state, removeCategory } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm

  // Lọc danh mục theo tên (case-insensitive)
  const filteredCategories = state.categorys.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-th-large me-2"></i> Quản lý Danh mục sản phẩm
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách các danh mục sản phẩm trong hệ thống. Bạn có thể thêm,
        sửa hoặc xóa danh mục theo nhu cầu.
      </p>
      <div className="table-container">
        {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Phần chọn số lượng hiển thị */}
          <div>
            <label className="d-flex align-items-center">
              Hiển thị
              <select className="custom-select custom-select-sm form-control form-control-sm w-auto mx-2">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              mục
            </label>
          </div>

          {/* Ô tìm kiếm căn phải */}
          <div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Link to={`/admin/category/add`} className="btn btn-primary mb-3 w-100">
          {" "}
          <IoMdAdd />
        </Link>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Id </th>
              <th scope="col">Danh mục</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => removeCategory(category._id)}
                  >
                    {" "}
                    <MdDelete />
                  </button>
                  <Link
                    to={`/admin/category/update/${category._id}`}
                    className="btn btn-warning me-2"
                  >
                    {" "}
                    <GrUpdate />
                  </Link>
                  <Link
                    to={`/admin/category/detail/${category._id}`}
                    className="btn btn-success me-2"
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

export default ListCategories;
