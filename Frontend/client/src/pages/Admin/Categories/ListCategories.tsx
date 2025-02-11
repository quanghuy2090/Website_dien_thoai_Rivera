import React, { useEffect, useState } from 'react'
import { Category, deleteCategories, getCategories, searchCategory } from '../../../services/category'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


const ListCategories = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  console.log(category)
  useEffect(() => {
    (async () => {
      fetchCategory();
    })()
  }, []);

  const fetchCategory = async () => {
    const res = await getCategories();
    setCategory(res.data.data);
  }
  const remove = async (_id: string) => {
    const isConfirmed = confirm("Are you sure you want to remove?");
    if (isConfirmed) {
      try {
        // Optimistically update the UI by removing the category from the state
        setCategory(prevCategories => prevCategories.filter(category => category._id !== _id));

        // Call the backend to delete the category
        await deleteCategories(_id);
        toast.success("Category deleted successfully")
      } catch (error) {
        // If an error occurs, revert the UI change or show an error message
        console.error("Error removing category:", error);
        toast.error("Category deleted unsuccessfully")
        // Optionally, re-fetch categories if necessary
      }
    }
  };
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        fetchCategory(); // Nếu ô tìm kiếm trống, hiển thị tất cả sản phẩm
        return;
      }
      try {
        const result = await searchCategory(search);
        setCategory(result?.data?.data || []);
      } catch (error) {
        console.log("Error searching products:", error);
      }
    };

    // Debounce (tránh gọi API quá nhiều lần)
    const delayDebounce = setTimeout(fetchSearchResults, 500); // Chờ 500ms sau khi nhập xong mới gọi API
    return () => clearTimeout(delayDebounce); // Xóa timeout nếu người dùng tiếp tục nhập
  }, [search]);
  return (
    <div className='col-md-10 ms-sm-auto px-md-4 '>
      <input
        type="text"
        className="form-control border-primary shadow-sm my-3 p-2"
        placeholder=" 🔍 Nhập tên danh mục..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Link to={`/admin/category/add`} className='btn btn-primary mb-3 w-100' > ➕</Link>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">id </th>
            <th scope="col">categories</th>
            <th scope="col">slug</th>
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody>
          {category.map((category) => (
            <tr>
              <td>{category._id}</td>
              <td>{category.name}</td>
              <td>{category.slug}</td>
              <td>
                <button className='btn btn-danger' onClick={() => remove(category._id)}> 🗑</button>
                <Link to={`/admin/category/update/${category._id}`} className='btn btn-warning'> ✏</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListCategories
