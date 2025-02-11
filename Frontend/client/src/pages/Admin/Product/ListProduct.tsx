import React, { useEffect, useState } from "react";
import { getAllProduct, Product, searchProduct } from "../../../services/product";
import { Link } from "react-router-dom";
import { removeProduct } from "./../../../services/product";
import toast from "react-hot-toast";


const ListProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    (async () => {
      fetchProduct();
    })();
  }, []);

  const fetchProduct = async () => {
    const res = await getAllProduct();
    setProducts(res.data.data);
  }
  const deleteProduct = async (_id: string) => {
    try {
      const isConfirmed = confirm(`Are you sure you want to delete`);
      if (isConfirmed) {
        setProducts((prevProducts) =>
          prevProducts.filter((products) => products._id !== _id)
        );
        await removeProduct(_id);
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Product deleted unsuccessfully");
    }
  };
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        fetchProduct(); // Nếu ô tìm kiếm trống, hiển thị tất cả sản phẩm
        return;
      }
      try {
        const result = await searchProduct(search);
        setProducts(result?.data?.data || []);
      } catch (error) {
        console.log("Error searching products:", error);
      }
    };

    // Debounce (tránh gọi API quá nhiều lần)
    const delayDebounce = setTimeout(fetchSearchResults, 500); // Chờ 500ms sau khi nhập xong mới gọi API
    return () => clearTimeout(delayDebounce); // Xóa timeout nếu người dùng tiếp tục nhập
  }, [search]);
  return (
    <div className="col-md-10 ms-sm-auto px-md-4">

      <input
        type="text" className="form-control"
        placeholder="Nhập tên sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <Link to={`/admin/products/add`} className="btn btn-primary">
        Add product
      </Link>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">price</th>
            <th scope="col">image</th>
            <th scope="col">stock</th>
            <th scope="col">color</th>
            <th scope="col">description</th>
            <th scope="col">categories</th>
            <th scope="col">action</th>

          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap", // Tự động xuống hàng nếu quá nhiều ảnh
                  gap: "5px", // Khoảng cách giữa các ảnh
                  justifyContent: "center", // Căn giữa ảnh trong ô
                }}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product ${index}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",  // Giữ đúng tỷ lệ, không méo
                        borderRadius: "8px", // Bo góc ảnh mềm mại hơn
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Hiệu ứng đổ bóng
                        transition: "transform 0.2s", // Hiệu ứng khi hover
                        cursor: "pointer"
                      }}

                    />
                  ))}
                </div>
              </td>
              <td>{product.stock}</td>
              <td>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: product.color,
                    border: "1px solid #000",
                    display: "inline-block"
                  }}
                ></div>
              </td>
              <td>{product.description}</td>
              <td>
                {/* Render category name if categoryId is an object */}
                {typeof product.categoryId === "object" &&
                  product.categoryId !== null
                  ? product.categoryId.name
                  : product.categoryId}
              </td>
              <td>
                <button
                  className="btn btn-danger m-2"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/products/update/${product._id}`}
                  className="btn btn-warning"
                >
                  Update
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;
