import React, { useContext, useState } from "react";
import { ColorContext } from "../../../context/ColorContext";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdAutoDelete, MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

const getContrastColor = (hexColor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const ListColor = () => {
  const { state, removeColor } = useContext(ColorContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColors = state.colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <div className="card mb-4 ">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0 ">Danh sách màu sắc</h5>
            <span className="text-primary">Bảng / Màu sắc sản phẩm</span>
          </div>
          <div className="d-flex gap-2 mb-3">
            <Link to={`/admin/color/add`} className="btn btn-primary">
              <IoMdAdd />
              Thêm màu mới
            </Link>
            <Link className="btn btn-info" to={`/admin/color/deleted`}>
              <MdAutoDelete />
            </Link>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập tên màu sắc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "300px" }}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Stt</th>
                  <th scope="col">Màu sắc</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col" className="text-center">
                    Tùy chọn
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredColors.map((color, index) => (
                  <tr key={color._id}>
                    <th>{index + 1}</th>
                    <td>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: color.name,
                          width: "30px",
                          height: "30px",
                          display: "inline-block",
                          border: "2px solid #adb5bd",
                          boxShadow: "0 0 0 1px rgba(0,0,0,.2)",
                        }}
                        title={color.name}
                      />
                    </td>
                    <td>{new Date(color.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => removeColor(color._id)}
                      >
                        <MdDelete />
                      </button>
                      <Link
                        to={`/admin/color/update/${color._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        <FaPen />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListColor;
