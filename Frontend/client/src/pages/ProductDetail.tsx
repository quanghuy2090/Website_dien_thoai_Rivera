import React, { useEffect, useState } from "react";
import { getProductById, Product } from "../services/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.css";
import toast from "react-hot-toast";
import { addCart, Carts } from "../services/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // Handle quantity increase
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrease
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      toast.success("Product id Successfully");
      setProduct(data.data);
      setRelatedProducts(data.relatedProducts);
      setMainImage(data.data.images[0]);
    })();
  }, [id]);

  const addToCart = async (productId?: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return nav("/login");
      }

      const selectedProductId = productId || product?._id; // Use productId if provided

      if (!selectedProductId) {
        toast.error("Sản phẩm không hợp lệ!");
        return;
      }

      const cartItem: Carts = {
        userId: user._id,
        productId: selectedProductId,
        quantity: quantity,
      };

      const { data } = await addCart(cartItem);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      console.log("Thêm vào giỏ hàng:", data);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = relatedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 150 }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Chi tiết sản phẩm
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Trang chủ</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Chi tiết</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      {/* Shop Detail Start */}
      <div className="container-fluid py-5">
        <div className="row px-xl-5">
          <div className="col-lg-5 pb-5">
            <div className="product-images">
              <div className="thumbnail-images">
                {product?.images.map((img, index) => (
                  <div
                    key={index}
                    className={`${img === mainImage ? "active" : ""}`} // Active class logic
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${index + 1}`} />
                  </div>
                ))}
              </div>
              <div className="main-image">
                <img src={mainImage!} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-7 pb-5">
            <h3 className="font-weight-semi-bold text-primary">
              {product?.name}
            </h3>
            <h3 className="font-weight-semi-bold mb-4 ">
              {formatPrice(product?.price)}
            </h3>
            <div className="d-flex mb-3">
              <p className="text-dark font-weight-medium mb-0 mr-3">
                Dung lượng:
              </p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-1"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-1">
                    256GB
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-2"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-2">
                    512GB
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-3"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-3">
                    1TB
                  </label>
                </div>
              </form>
            </div>
            <div className="d-flex mb-4">
              <p className="text-dark font-weight-medium mb-0 mr-3">Màu sắc:</p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-1"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-1">
                    Đen
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-2"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-2">
                    Trắng
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-3"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-3">
                    Đỏ
                  </label>
                </div>
              </form>
            </div>
            <div className="d-flex align-items-center mb-4 pt-2">
              <div className="input-group quantity mr-3" style={{ width: 130 }}>
                <div className="input-group-btn">
                  <button
                    className="btn btn-primary btn-minus"
                    onClick={decreaseQuantity}
                  >
                    <i className="fa fa-minus" />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control bg-secondary text-center"
                  value={quantity}
                  readOnly
                />
                <div className="input-group-btn">
                  <button
                    className="btn btn-primary btn-plus"
                    onClick={increaseQuantity}
                  >
                    <i className="fa fa-plus" />
                  </button>
                </div>
              </div>
              <button
                className="btn btn-primary px-3"
                onClick={() => addToCart(product?._id)}
              >
                <i className="fa fa-shopping-cart mr-1" /> Thêm giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="container-fluid py-5">
          <div className="text-center mb-4">
            <h2 className="section-title px-5">
              <span className="px-2">Sản phẩm cùng danh mục</span>
            </h2>
          </div>
          <div className="row px-xl-5">
            <div className="col">
              <div className="owl-carousel related-carousel">
                <div className="row">
                  {currentProducts.map((item) => (
                    <div
                      key={item._id}
                      className="col-lg-3 col-md-6 col-sm-12 pb-1"
                    >
                      <div className="card product-item border-0 mb-4">
                        <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                          <img
                            className="img-fluid"
                            src={item.images[0]}
                            alt={item.name}
                          />
                        </div>
                        <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                          <Link to={`/product/${item._id}`}>
                            <h6 className="text-truncate mb-3">{item.name}</h6>
                          </Link>
                          <div className="d-flex justify-content-center">
                            <h6>{formatPrice(item.price)}</h6>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-between bg-light border">
                          <button
                            className="btn btn-sm text-dark p-0"
                            onClick={() => addToCart(item._id)}
                          >
                            <i className="fas fa-shopping-cart text-primary mr-1" />
                            Thêm giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="col-12 d-flex justify-content-center mt-3">
            <button
              className="btn btn-primary mx-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              «
            </button>
            <span className="mt-2">
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-primary mx-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
      {/* Shop Detail End */}
    </>
  );
};

export default ProductDetail;
