import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { IoMdAdd } from "react-icons/io";
import { MdAutoDelete, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { CategoryContext } from "../../../context/CategoryContext";
const ListCategories = () => {
  const { state, removeCategory } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Lọc danh mục theo tên (case-insensitive)
  const filteredCategories = state.categorys.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) && // Lọc theo tên
      category.isDeleted !== true // Chỉ hiển thị các danh mục chưa bị xóa (isDeleted: false)
  );
  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách danh mục</h5>
            <span className="text-primary">Bảng / Danh mục sản phẩm</span>
          </div>

          {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Phần chọn số lượng hiển thị */}
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
          <div className="d-flex gap-2 mb-3">
            <Link to={`/admin/category/add`} className="btn btn-primary">
              <IoMdAdd /> Thêm danh mục
            </Link>
            <Link className="btn btn-info" to={`/admin/category/delete`}>
              <MdAutoDelete />
            </Link>
          </div>

          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Stt</th>
                <th scope="col">Danh mục</th>
                <th scope="col">Slug</th>
                <th scope="col">Ngày tạo</th>
                {/* <th scope="col">Cập nhật lần cuối</th> */}
                <th scope="col">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories
                .slice(0, itemsPerPage)
                .map((category, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    {/* <td>{new Date(category.updatedAt).toLocaleString()}</td> */}
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
                        <FaPen />
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
    </div>
  );
};

export default ListCategories;
