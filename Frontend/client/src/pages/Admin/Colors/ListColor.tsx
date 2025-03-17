import React, { useContext } from "react";
import { ColorContext } from "../../../context/ColorContext";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
const ListColor = () => {
  // const { state } = useContext(ColorContext);
  const { state, removeColor } = useContext(ColorContext);

  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-th-large me-2"></i> Quản lý Màu sắc sản phẩm
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách các màu sắc sản phẩm trong hệ thống. Bạn có thể thêm,
        sửa hoặc xóa màu sắc theo nhu cầu.
      </p>
      <div className="table-container">
        {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Phần chọn số lượng hiển thị */}

          {/* Ô tìm kiếm căn phải */}
        </div>

        <Link to={`/admin/color/add`} className="btn btn-primary mb-3 w-100">
          {" "}
          <IoMdAdd />
        </Link>

        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Stt</th>
              <th scope="col">Màu sắc</th>
              <th scope="col">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {state.colors.map((color, index) => (
              <tr key={color._id}>
                <th scope="row">{index + 1}</th>
                <td>{color.name}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => removeColor(color._id)}
                  >

                    <MdDelete />
                  </button>
                  <button className="btn btn-warning">Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListColor;
