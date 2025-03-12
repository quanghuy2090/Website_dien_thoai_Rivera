import React, { useEffect, useState } from "react";
import { getProductById, Product } from "../../services/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.css";
import toast from "react-hot-toast";
import { addCart, Carts } from "../../services/cart";

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

  const formatPrice = (price: number) => {
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
          <h3 className="h4 font-weight-bold text-dark">{product?.name}</h3>

            <div className="d-flex align-items-center mb-2">
              <div className="text-primary">
                <i className="fas fa-star"> </i>
                <i className="fas fa-star"> </i>
                <i className="fas fa-star"> </i>
                <i className="fas fa-star"> </i>
                <i className="fas fa-star-half-alt"> </i>
              </div>
              <span className="ml-2 text-muted">
                (10 Review(s)) |
                <a className="text-dark" href="#">
                  {" "}
                  Add your review{" "}
                </a>
              </span>
            </div>

            <h2 className="h3 font-weight-bold mb-2 text-primary">
              {formatPrice(product?.price ?? 0)}
            </h2>

            <div className="text-success font-weight-bold mb-4">IN STOCK</div>
            <p className="mb-4 text-dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="product-options">
              <div className="row align-items-center mb-3">
              <div className="col-auto">
  <label className="form-label fw-bold text-dark">Dung Lượng</label>
</div>

                <div className="col-auto">
                  <select className="form-select form-select-sm w-auto border-dark">
                    <option value="0">64GB</option>
                    <option value="1">128GB</option>
                    <option value="2">256GB</option>
                  </select>
                </div>
                <div className="col-auto">
  <label className="form-label fw-bold text-dark">Màu Sắc</label>
</div>

                <div className="col-auto">
                  <select className="form-select form-select-sm w-auto border-dark">
                    <option value="0">Đỏ</option>
                    <option value="1">Đen</option>
                    <option value="2">Trắng</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4 pt-2">
              {/* Nút Giảm */}
              <button
                className="btn btn-primary me-3"
                onClick={decreaseQuantity}
              >
                <i className="fa fa-minus"></i>
              </button>

              {/* Ô Input */}
              <div
                className="d-flex align-items-center border border-dark rounded px-3 bg-light"
                style={{ width: 80, height: 38 }}
              >
                <input
                  type="text"
                  className="form-control text-center border-0 bg-light"
                  style={{ width: "100%" }}
                  value={quantity}
                  readOnly
                />
              </div>

              {/* Nút Tăng */}
              <button
                className="btn btn-primary ms-3"
                onClick={increaseQuantity}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>

            <br />
            <div>
              <button
                className="btn btn-danger px-3 rounded-pill"
                onClick={() => addToCart(product?._id)}
              >
                <i className="fa fa-shopping-cart me-1" /> Thêm giỏ hàng
              </button>
            </div>

            {/* <div className="d-flex align-items-center mb-4 pt-2">
              <div className="input-group quantity mr-3" style={{ width: 130 }}>
                <div className="input-group-btn">
                  <button className="btn btn-primary btn-minus">
                    <i className="fa fa-minus" />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control bg-secondary text-center"
                  defaultValue={1}
                />
                <div className="input-group-btn">
                  <button className="btn btn-primary btn-plus">
                    <i className="fa fa-plus" />
                  </button>
                </div>
              </div>
              <button className="btn btn-primary px-3">
                <i className="fa fa-shopping-cart mr-1" /> Thêm giỏ hàng
              </button>
            </div> */}
            {/* <div className="d-flex pt-2">
        <p className="text-dark font-weight-medium mb-0 mr-2">Share on:</p>
        <div className="d-inline-flex">
          <a className="text-dark px-2" href="">
            <i className="fab fa-facebook-f" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-twitter" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-linkedin-in" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-pinterest" />
          </a>
        </div>
      </div> */}
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="nav nav-tabs justify-content-center border-secondary mb-4">
              <a
                className="nav-item nav-link active"
                data-toggle="tab"
                href="#tab-pane-1"
              >
                Giới thiệu
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-2"
              >
                Thông tin sản phẩm
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-3"
              >
                Đánh giá (0)
              </a>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="tab-pane-1">
                <h4 className="mb-3 text-dark">Additional Information</h4>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">
                        Sit erat duo lorem duo ea consetetur, et eirmod
                        takimata.
                      </li>
                      <li className="list-group-item px-0">
                        Amet kasd gubergren sit sanctus et lorem eos sadipscing
                        at.
                      </li>
                      <li className="list-group-item px-0">
                        Duo amet accusam eirmod nonumy stet et et stet eirmod.
                      </li>
                      <li className="list-group-item px-0">
                        Takimata ea clita labore amet ipsum erat justo voluptua.
                        Nonumy.
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">
                        Sit erat duo lorem duo ea consetetur, et eirmod
                        takimata.
                      </li>
                      <li className="list-group-item px-0">
                        Amet kasd gubergren sit sanctus et lorem eos sadipscing
                        at.
                      </li>
                      <li className="list-group-item px-0">
                        Duo amet accusam eirmod nonumy stet et et stet eirmod.
                      </li>
                      <li className="list-group-item px-0">
                        Takimata ea clita labore amet ipsum erat justo voluptua.
                        Nonumy.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade text-dark" id="tab-pane-2">
                <p>{product?.description}</p>
              </div>
              {/* <div className="tab-pane fade" id="tab-pane-3">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="mb-4">
                      1 review for "Colorful Stylish Shirt"
                    </h4>
                    <div className="media mb-4">
                      <img
                        src="img/user.jpg"
                        alt="Image"
                        className="img-fluid mr-3 mt-1"
                        style={{ width: 45 }}
                      />
                      <div className="media-body">
                        <h6>
                          John Doe
                          <small>
                            {" "}
                            - <i>01 Jan 2045</i>
                          </small>
                        </h6>
                        <div className="text-primary mb-2">
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star-half-alt" />
                          <i className="far fa-star" />
                        </div>
                        <p>
                          Diam amet duo labore stet elitr ea clita ipsum, tempor
                          labore accusam ipsum et no at. Kasd diam tempor rebum
                          magna dolores sed sed eirmod ipsum.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 className="mb-4">Leave a review</h4>
                    <small>
                      Your email address will not be published. Required fields
                      are marked *
                    </small>
                    <div className="d-flex my-3">
                      <p className="mb-0 mr-2">Your Rating * :</p>
                      <div className="text-primary">
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                      </div>
                    </div>
                    <form>
                      <div className="form-group">
                        <label htmlFor="message">Your Review *</label>
                        <textarea
                          id="message"
                          cols={30}
                          rows={5}
                          className="form-control"
                          defaultValue={""}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input type="text" className="form-control" id="name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                        />
                      </div>
                      <div className="form-group mb-0">
                        <input
                          type="submit"
                          defaultValue="Leave Your Review"
                          className="btn btn-primary px-3"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
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
