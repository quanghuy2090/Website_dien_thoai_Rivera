import { useEffect, useState } from "react";
import { getAllProduct, Product } from "../services/product";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(4);

  useEffect(() => {
    getAllProduct()
      .then(({ data }) => {
        toast.success("Welcome");
        setProducts(data);
        console.log(data);
      })
      .catch((error) => toast.error("Error: " + error.message))
      .finally(() => setLoading(false));
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

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
                        <img width={200} src={product.images} alt="" />
                      </div>
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

        {/* Pagination Controls */}
        <div className="pagination d-flex justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''} me-2`}
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