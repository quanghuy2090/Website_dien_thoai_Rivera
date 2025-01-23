import { useEffect, useState } from "react";
import { getAllProduct, Product } from "../services/product";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          {products.map((product, index) => (
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

                      <div className="card-back row">
                        <a href="#" className="btn btn-primary m-2">
                          Add to cart
                        </a>
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-primary"
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
      </div>
    </>
  );
};

export default ProductPage;
