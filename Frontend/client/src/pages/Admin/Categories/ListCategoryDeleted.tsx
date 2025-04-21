import React, { useContext, useState } from 'react'
import { CategoryContext } from '../../../context/CategoryContext';
import { FaUndo } from 'react-icons/fa';
import { Category } from '../../../services/category';


const ListCategoryDeleted = () => {
    const { state, updateCategoriesRestoted } = useContext(CategoryContext);
    const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm

    const filteredCategories = state.deletedCategorys.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) && // Lọc theo tên
            category.isDeleted !== false // Chỉ hiển thị các danh mục chưa bị xóa (isDeleted: false)
    );
    const handleRestore = (_id: string, category: Category) => {
        if (window.confirm("Bạn có chắc chắn muốn khôi phục danh mục này?")) {
            updateCategoriesRestoted(_id, category);
        }
    };
    return (
        <div className="content">
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách danh mục đã xóa</h5>
                        <span className="text-primary">Bảng / Danh mục sản phẩm</span>
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
                                placeholder="Nhập tên danh mục..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Stt</th>
                                <th scope="col">Danh mục</th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Người thực hiện</th>
                                <th scope="col">Ngày tạo</th>
                                <th scope="col">Cập nhật lần cuối</th>
                                <th scope="col">Tùy chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{category.name}</td>
                                    <td>{category.slug}</td>
                                    <td>{category.deletedBy.email}-{category.deletedBy.userName}</td>
                                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(category.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleRestore(category._id, category)}
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

export default ListCategoryDeleted