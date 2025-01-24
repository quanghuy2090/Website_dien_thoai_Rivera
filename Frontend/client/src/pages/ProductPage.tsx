import { useEffect, useState } from "react";
import { getAllProduct, Product } from "../services/product";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(4);
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Default sort order

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        const data = response.data || []; // Ensure data is an array
        toast.success("Welcome");
        setProducts(data);
      } catch (error) {
        toast.error("Error: " + error.message);
        setProducts([]); // Reset products to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Sort products based on the selected order
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price; // Ascending order
    } else {
      return b.price - a.price; // Descending order
    }
  });

  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
    setCurrentPage(1); // Reset to the first page when sorting
  };

  return (
    <>
      <div className="container">
        <h4>Products</h4>

        {/* Sorting Control */}
        <div className="mb-3">
          <div className="row">
            <div className="col-md-2">
              <label htmlFor="sort" className="form-label">
                Lọc theo giá:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className="form-select"
              >
                <option value="asc">Thấp đến Cao</option>
                <option value="desc">Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="row card-section">
          {currentProducts.map((product, index) => (
            <div key={index} className="section col-md-3">
              <div className="card-margin">
                <div className="">
                  <div className="card m-2">
                    <div className="cover item-a">
                      <h1 className="card-name">{product.name}</h1>
                      <span className="price">${product.price}</span>

                      <div className="card-back row d-flex justify-content-center">
                        <a href="#" className="btn btn-primary w-auto m-2">
                          Add to cart
                        </a>
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-primary w-auto m-2"
                        >
                          View detail
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination d-flex justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              } me-2`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductPage;