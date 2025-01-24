import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAllProduct, Product } from "../services/product";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
      setLoading(false);
    })();
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
        {/* @for track item.id - map key=product.id (index) */}
        <div className="row card-section">
          {products.map((product, index) => (
            <div key={index} className="section col-md-3">
              <div className="card-margin">
                <div className="">
                  <div className="card m-2">
                    <div className="cover item-a">
                      {/* <div className="card-image">
                        <img width={200} src={product.images} alt="" />
                      </div> */}
                      <h1 className="card-name">{product.name}</h1>
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
      </div>
    </>
  );
};

export default ProductPage;
