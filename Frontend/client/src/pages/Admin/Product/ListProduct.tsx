import React, { useEffect, useState } from 'react'
import { getAllProduct, Product } from '../../../services/product'
import { Link } from 'react-router-dom';
import { removeProduct } from './../../../services/product';
import toast from 'react-hot-toast';

const ListProduct = () => {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    (async () => {
      const res = await getAllProduct()
      setProducts(res.data.data);
    })()
  }, [])
  const deleteProduct = async (_id: string) => {
    try {
      const isConfirmed = confirm(`Are you sure you want to delete`);
    if (isConfirmed) {
      setProducts(prevProducts => prevProducts.filter(products => products._id!==_id));
      await removeProduct(_id);
      toast.success("Product deleted successfully")
    }
    } catch (error) {
      console.log(error);
      toast.error("Product deleted unsuccessfully")
    }
    
  }
  
  return (
    <div className='main-content'>
      <Link to={`/admin/products/add`} className='btn btn-primary'>Add product</Link>
    <table className="table-container">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">name</th>
      <th scope="col">price</th>
       <th scope="col">description</th>
      <th scope="col">categories</th>    
    </tr>
  </thead>
  <tbody>
          {products.map((product) => (
            <tr>
              <td>{ product._id}</td>
              <td>{product.name }</td>
              <td>{ product.price}</td>
              <td>{ product.description}</td>
              <td>
                {/* Render category name if categoryId is an object */}
                {typeof product.categoryId === 'object' && product.categoryId !== null
                  ? product.categoryId.name
                  : product.categoryId}
              </td>
              <td>
                <button className='btn btn-danger' onClick={()=>deleteProduct(product._id)}>delete</button>
              </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  )
}

export default ListProduct
