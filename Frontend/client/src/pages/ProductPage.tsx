import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAllProduct, Product } from "../services/product";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(4); // Adjust the number of products per page as needed

  useEffect(() => {
    (async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
      setLoading(false);
    })();
  }, []);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        <h4>Products</h4>

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
                      <div className="card-image">
                        <img width={200} height={200} src={product.image} alt={product.name} />
                      </div>
                      <h3 className="card-name">{product.name}</h3>
                      <span className="price">${product.price}</span>

                      <div className="card-back row d-flex justify-content-center">
                        <a href="#" className="btn btn-primary w-auto m-2">
                          Add to cart
                        </a>
                        <Link
                          to={`/product/${product._id}`}
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

        {/* Pagination Controls */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ProductPage;