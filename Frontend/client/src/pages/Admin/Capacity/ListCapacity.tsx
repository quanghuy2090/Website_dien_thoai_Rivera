import React, { useContext, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { CapacityContext } from "../../../context/CapacityContext";
import { MdAutoDelete, MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import "../../../components/Admin.css";

const ListCapacity = () => {
  const { states, removeCapacity } = useContext(CapacityContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCapacitys = states.capacitys.filter((capacity) =>
    capacity.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách bộ nhớ</h5>
            <span className="text-primary">Bảng / Bộ nhớ sản phẩm</span>
          </div>

          <div className="d-flex gap-2 mb-3">
            <Link to={`/admin/capacity/add`} className="btn btn-primary">
              <IoMdAdd /> Thêm bộ nhớ
            </Link>
            <Link className="btn btn-info" to={`/admin/capacity/deleted`}>
              <MdAutoDelete />
            </Link>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập tên bộ nhớ..."
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
                  <th scope="col">Bộ nhớ</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col">Tùy chọn</th>
                </tr>
              </thead>
              <tbody>
                {filteredCapacitys.map((capacity, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{capacity.value}</td>
                    <td>{new Date(capacity.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => removeCapacity(capacity._id)}
                      >
                        <MdDelete />
                      </button>
                      <Link
                        to={`/admin/capacity/update/${capacity._id}`}
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

export default ListCapacity;
