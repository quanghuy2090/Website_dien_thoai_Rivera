import React, { useContext } from "react";
import { ColorContext } from "../../../context/ColorContext";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
const ListColor = () => {
  // const { state } = useContext(ColorContext);
  const { state, removeColor } = useContext(ColorContext);

  return (
    <div className="content">
      <div className="card mb-4 ">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0 ">Danh sách màu sắc</h5>
            <span className="text-primary">Bảng / Màu sắc sản phẩm</span>

          </div>
          <Link to={`/admin/color/add`} className="btn btn-primary mb-3">
            <IoMdAdd />
            Thêm màu mới
          </Link>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Stt</th>
                  <th scope="col">Tên màu</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col" className="text-center">Tùy chọn</th>
                </tr>
              </thead>
              <tbody>
                {state.colors.map((color, index) => (
                  <tr key={color._id}>
                    <th>{index + 1}</th>
                    <td>
                      <span className="badge rounded-pill bg-secondary">{color.name}</span>
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
