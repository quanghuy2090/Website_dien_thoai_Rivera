import React, { useContext } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { CapacityContext } from '../../../context/CapacityContext'
import { MdDelete } from 'react-icons/md'
import { FaPen } from 'react-icons/fa'

const ListCapacity = () => {
    const { states, removeCapacity } = useContext(CapacityContext);
    return (
        <div className="content">
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="fas fa-th-large me-2"></i> Quản lý Bộ nhớ sản phẩm
            </h1>
            <p className="mb-4 text-secondary">
                Đây là danh sách các bô nhớ  sản phẩm trong hệ thống. Bạn có thể thêm,
                sửa hoặc xóa bộ nhớ theo nhu cầu.
            </p>
            <div className="table-container">
                {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* Phần chọn số lượng hiển thị */}

                    {/* Ô tìm kiếm căn phải */}
                </div>

                <Link to={`/admin/capacity/add`} className="btn btn-primary mb-3 w-100">
                    {" "}
                    <IoMdAdd />
                </Link>

                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Stt</th>
                            <th scope="col">Bộ nhớ</th>
                            <th scope="col">Ngày tạo</th>
                            <th scope="col">Tùy chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {states.capacitys.map((capacity, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{capacity.value}</td>
                                <td>{new Date(capacity.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-danger me-2"
                                        onClick={() => removeCapacity(capacity._id)}
                                    >

                                        <MdDelete />
                                    </button>
                                    <Link to={`/admin/capacity/update/${capacity._id}`} className="btn btn-warning">  <FaPen /></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListCapacity