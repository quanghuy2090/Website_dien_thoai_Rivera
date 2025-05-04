import React, { useContext, useState } from "react";
import { CapacityContext } from "../../../context/CapacityContext";
import { Capacity } from "../../../services/capacity";
import { FaUndo } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListCapacityDeleted = () => {
  const { states, updateCapacityRestore } = useContext(CapacityContext);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCapacitys = states.deleteCapacity.filter(
    (capacity) =>
      capacity.value.toLowerCase().includes(searchTerm.toLowerCase()) &&
      capacity.isDeleted === true
  );
  const handleRestore = (_id: string, color: Capacity) => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục màu sắc này?")) {
      updateCapacityRestore(_id, color);
    }
  };
  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách bộ nhớ đã xóa</h5>
            <span className="text-primary">Bảng / Bộ nhớ sản phẩm</span>
          </div>

          <div className="d-flex gap-2 mb-3">
            <Link className="btn btn-info" to={`/admin/capacity`}>
              <FaUndo />
            </Link>
          </div>

          {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Phần chọn số lượng hiển thị */}
            <div></div>

            {/* Ô tìm kiếm căn phải */}
            <div>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nhập tên bộ nhớ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Stt</th>
                <th scope="col">Bộ nhớ</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Cập nhật lần cuối</th>
                <th scope="col">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {filteredCapacitys.map((capacity, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{capacity.value}</td>
                  <td>{new Date(capacity.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(capacity.updatedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleRestore(capacity._id, capacity)}
                    >
                      <FaUndo />
                    </button>
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

export default ListCapacityDeleted;
