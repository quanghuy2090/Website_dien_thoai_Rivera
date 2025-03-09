import React, { useEffect, useState } from "react";
import { getAllProduct, Product, searchProduct } from "../../../services/product";
import { Link } from "react-router-dom";
import { removeProduct } from "../../../services/product";
import toast from "react-hot-toast";
import { GrUpdate } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
const ListProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const res = await getAllProduct();
    setProducts(res.data.data);
  };

  const deleteProduct = async (_id: string) => {
    try {
      const isConfirmed = window.confirm(`Are you sure you want to delete?`);
      if (isConfirmed) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== _id)
        );
        await removeProduct(_id);
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        fetchProduct();
        return;
      }
      try {
        const result = await searchProduct(search);
        setProducts(result?.data?.data || []);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-cube me-2"></i> Quản lý Sản phẩm
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách sản phẩm trong cửa hàng. Bạn có thể quản lý, chỉnh sửa hoặc thêm mới sản phẩm.
      </p>
      {/* Bảng danh sách sản phẩm */}
      <div className="table-container">
        {/* <h2 className="h5 mb-4">DataTables Example</h2> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Phần chọn số lượng hiển thị */}
          <div>
            <label className="d-flex align-items-center">
              Show
              <select className="custom-select custom-select-sm form-control form-control-sm w-auto mx-2">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>
          </div>

          {/* Ô tìm kiếm căn phải */}
          <div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Link to={`/admin/products/add`} className="btn btn-primary">
          <IoMdAdd />
        </Link>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>short_description</th>
              <th>long_description</th>
              <th>images</th>
              <th> variants</th>
              <th>Categories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.short_description}</td>
                <td>{product.long_description}</td>
                {/* Hiển thị ảnh sản phẩm */}
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      flexWrap: "wrap",
                    }}
                  >
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product ${index}`}
                        className="rounded shadow-sm"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          transition: "transform 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    ))}
                  </div>
                </td>

                <td>
                  <table className="table table-bordered table-sm text-center">
                    <thead>
                      <tr className="bg-light">
                        <th>Dung lượng</th>
                        <th>Màu sắc</th>
                        <th>Giá</th>
                        <th>Stock</th>
                        <th>SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((v, index) => (
                        <tr key={index}>
                          <td>{v.capacity}</td>
                          <td>{v.color}</td>
                          <td>{v.price}</td>
                          <td>{v.stock}</td>
                          <td>{v.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

                {/* Hiển thị danh mục sản phẩm */}
                <td>
                  {typeof product.categoryId === "object" && product.categoryId !== null
                    ? product.categoryId.name
                    : product.categoryId}
                </td>

                {/* Nút hành động */}
                <td>
                  <button className="btn btn-danger me-2 " onClick={() => deleteProduct(product._id)}>
                    <MdDelete />
                  </button>
                  <Link to={`/admin/products/update/${product._id}`} className="btn btn-warning me-2">
                    <GrUpdate />
                  </Link>
                  <Link to={`/admin/products/detail/${product._id}`} className="btn btn-info mt-2">
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
