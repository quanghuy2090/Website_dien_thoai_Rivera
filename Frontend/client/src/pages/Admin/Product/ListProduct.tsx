import React, { useEffect, useState } from "react";
import { getAllProduct, Product, searchProduct } from "../../../services/product";
import { Link } from "react-router-dom";
import { removeProduct } from "../../../services/product";
import toast from "react-hot-toast";

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
    <div className="col-md-10 ms-sm-auto px-md-4">
      {/* Ô tìm kiếm */}
      <input
        type="text"
        className="form-control border-primary shadow-sm my-3 p-2"
        placeholder="🔍 Nhập tên sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Nút thêm sản phẩm */}
      <Link to={`/admin/products/add`} className="btn btn-primary mb-3 w-100">
        ➕
      </Link>

      {/* Bảng danh sách sản phẩm */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Stock</th>
              <th>Color</th>
              <th>Description</th>
              <th>Categories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>

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

                <td>{product.stock}</td>

                {/* Hiển thị màu sản phẩm */}
                <td>
                  <div
                    className="rounded-circle border border-dark"
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: product.color,
                      display: "inline-block",
                    }}
                  ></div>
                </td>

                <td>{product.description}</td>

                {/* Hiển thị danh mục sản phẩm */}
                <td>
                  {typeof product.categoryId === "object" && product.categoryId !== null
                    ? product.categoryId.name
                    : product.categoryId}
                </td>

                {/* Nút hành động */}
                <td>
                  <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>
                    🗑
                  </button>
                  <Link to={`/admin/products/update/${product._id}`} className="btn btn-warning">
                    ✏
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
