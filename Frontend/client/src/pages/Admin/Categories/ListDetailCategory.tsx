import React, { useEffect, useState } from 'react'
import { Category, getCategoriesById } from '../../../services/category'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ListDetailCategory = () => {
    const { id } = useParams();
    const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);

    useEffect(() => {
        (async () => {
            const { data } = await getCategoriesById(id!);
            setCategoryDetail(data.data);
            toast.success("Category id successfully")
        })()
    }, []);
    return (
        <div className='content'>
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="bi bi-tags me-2"></i> Chi Tiết Danh Mục
            </h1>
            <p className="mb-4 text-secondary">
                Đây là thông tin chi tiết của danh mục "<strong>{categoryDetail?.name}</strong>". Bạn có thể xem thông tin và quản lý danh mục<cite></cite> tại đây.
            </p>
            <div className="table-container">
                <table className="table table-bordered border-primary">
                    <tbody>
                        <tr>
                            <th >Id</th>
                            <td>{categoryDetail?._id}</td>
                        </tr>
                        <tr>
                            <th >Category</th>
                            <td>{categoryDetail?.name}</td>
                        </tr>
                        <tr>
                            <th >Slug</th>
                            <td>{categoryDetail?.slug}</td>
                        </tr>
                        <tr>
                            <th >Products</th>
                            <td>
                                <table className="table table-bordered border-primary">
                                    <thead >
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Description</th>
                                            <th>Images</th>
                                            <th>Stock</th>
                                            <th>Color</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryDetail?.products?.map((r, index) => (
                                            <tr key={index}>
                                                <td>{r._id}</td>
                                                <td>{r.name}</td>
                                                <td>${r.price}</td>
                                                <td>{r.description}</td>
                                                <td>
                                                    {r.images.map((image, i) => (
                                                        <img key={i} src={image} alt="" width={60} className="me-2 rounded" />
                                                    ))}
                                                </td>
                                                <td>{r.stock}</td>
                                                <td>{r.color}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default ListDetailCategory