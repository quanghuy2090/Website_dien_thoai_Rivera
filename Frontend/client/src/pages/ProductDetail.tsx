import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProductById, Product } from "../services/product";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(({ data }) => {
          setProduct(data);
          toast.success("Product loaded successfully");
        })
        .catch((error) => toast.error("Error: " + error.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  //   const handleAddToCart = () => {
  //     toast.success(`Added ${quantity} ${product?.name} to cart`);
  //   };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <h4 className="mt-5">Product not found</h4>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div
            className="product-info-box p-2 border rounded"
            style={{ height: "350px", overflow: "auto" }}
          >
            <div className="product-image text-center">
              <img
                src={product.images}
                alt={product.name}
                width={200}
                className="img-fluid"
              />
            </div>
            <h5 className="mt-2">{product.name}</h5>
            <p className="text-muted small">Brand: {product.brand}</p>
            <p className="mb-1">
              Price: <strong>${product.price}</strong>
            </p>
            <p className="small">
              Release Date: {new Date(product.releaseDate).toLocaleDateString()}
            </p>
            <p className="small">
              Stock:{" "}
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
            <p className="small">{product.description}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="add-to-cart-box p-2 border rounded"
            style={{
              height: "350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h6>Quantity</h6>
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                style={{ width: "70px" }}
              />
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary w-100"
              //   onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
