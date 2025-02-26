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
        <div className='col-md-10 ms-sm-auto px-md-4 mt-4 '>
            <table className='table table-striped table-bordered'>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <td>{categoryDetail?._id}</td>
                    </tr>
                    <tr>
                        <th>
                            Category
                        </th>
                        <td>{categoryDetail?.name}</td>
                    </tr>
                    <tr>
                        <th>Slug</th>
                        <td>{categoryDetail?.slug}</td>
                    </tr>
                    <tr>
                        <th>Product</th>
                        <td>{categoryDetail?.products?.map((r) => (
                            <tr>
                                <td>{r._id}</td>
                                <td>{r.name}</td>
                                <td>{r.price}</td>
                                <td>{r.description}</td>
                                <td>
                                    {r.images.map((image) => (
                                        <img src={image} alt="" width={100} />
                                    ))}
                                </td>
                                <td>{r.stock}</td>
                                <td>{r.color}</td>

                            </tr>
                        ))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ListDetailCategory