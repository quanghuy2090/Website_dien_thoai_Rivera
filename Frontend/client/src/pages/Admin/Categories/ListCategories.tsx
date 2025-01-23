import React, { useEffect, useState } from 'react'
import { Category, deleteCategories, getCategories } from '../../../services/category'
import { Link } from 'react-router-dom';


const ListCategories = () => {
  const [category, setCategory] = useState<Category[]>([]);
  console.log(category)
  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategory(data.data);
    })()
  }, [])
  const remove = async (_id: string) => {
  const isConfirmed = confirm("Are you sure you want to remove?");
  if (isConfirmed) {
    try {
      // Optimistically update the UI by removing the category from the state
      setCategory(prevCategories => prevCategories.filter(category => category._id !== _id));

      // Call the backend to delete the category
      await deleteCategories(_id);
    } catch (error) {
      // If an error occurs, revert the UI change or show an error message
      console.error("Error removing category:", error);
      // Optionally, re-fetch categories if necessary
    }
  }
};
  return (
    <div className='main-content'>
      <Link to={`/admin/category/add`} className='btn btn-primary' >add categories</Link>
      <table className="table-container">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">categories</th>
      <th scope="col">slug</th>
            
      <th scope="col">action</th>
    </tr>
  </thead>
  <tbody>
          {category.map((category) => (
            <tr>
              <td>{ category._id}</td>
              <td>{category.name}</td>
              <td>{ category.slug}</td>
              <td>
                <button className='btn btn-danger' onClick={() => remove(category._id)}>delete</button>
                <Link to={`/admin/category/update/${category._id}`} className='btn btn-danger'>Update</Link>
              </td>
     </tr>
   ))}
  </tbody>
</table>
    </div>
  )
}

export default ListCategories
