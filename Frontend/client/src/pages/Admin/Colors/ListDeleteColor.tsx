import React, { useContext, useState } from 'react'
import { ColorContext } from '../../../context/ColorContext'
import { FaUndo } from 'react-icons/fa';
import { Color } from '../../../services/color';

const ListDeleteColor = () => {
    const { state, updateColorRestored } = useContext(ColorContext);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredColors = state.deletedColor.filter((color) =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        color.isDeleted! == true
    );
    const handleRestore = (_id: string, color: Color) => {
        if (window.confirm("Bạn có chắc chắn muốn khôi phục màu sắc này?")) {
            updateColorRestored(_id, color);
        }
    };
    return (
        <div className="content">
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách màu sắc đã xóa</h5>
                        <span className="text-primary">Bảng / Màu sắc sản phẩm</span>
                    </div>

                    {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* Phần chọn số lượng hiển thị */}
                        <div>

                        </div>

                        {/* Ô tìm kiếm căn phải */}
                        <div>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Nhập tên màu sắc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Stt</th>
                                <th scope="col">Màu sắc</th>
                                <th scope="col">Ngày tạo</th>
                                <th scope="col">Cập nhật lần cuối</th>
                                <th scope="col">Tùy chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredColors.map((color, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{color.name}</td>
                                    <td>{new Date(color.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(color.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleRestore(color._id, color)}
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
    )
}

export default ListDeleteColor