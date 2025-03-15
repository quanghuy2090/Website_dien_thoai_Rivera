import React, { useEffect, useRef, useState } from "react";
import { getProductById, Product } from "../../services/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.css";
import toast from "react-hot-toast";
import { addCart, Carts } from "../../services/cart";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [activeTab, setActiveTab] = useState("tab01"); // Default active tab
  const productDetailSliderRef = useRef<Slider | null>(null); // Ref for the first slider

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    speed: 300,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
        items: {
          productId: selectedProductId,
          quantity: quantity,
        },
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

  const handleVariantChange = (variant: Product["variants"][0]) => {
    setSelectedVariant(variant);
  };

  return (
    <>
      {/* BREADCRUMB */}
      <div id="breadcrumb" className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/product-page">Sản phẩm</a>
                </li>
                <li className="active">{product?.name}</li>
              </ul>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* /BREADCRUMB */}

      {/* Shop Detail Start */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-md-push-2 d-flex justify-content-center">
              <div id="product-main-img">
                <div className="product-preview">
                  <img src={mainImage!} alt="" />
                </div>
              </div>
            </div>
            {/* /Product main img */}
            {/* Product thumb imgs */}
            <div className="col-md-2 col-md-pull-5">
              <div id="product-imgs">
                <div className="product-preview">
                  {product?.images.map((img, index) => (
                    <div
                      key={index}
                      className={` ${img === mainImage ? "active" : ""}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* /Product thumb imgs */}
            <div className="col-md-5">
              <div className=" product-details">
                <div className="">
                  <h3 className="h3 font-weight-bold">{product?.name}</h3>
                  <h3 className="h5 mt-2">SKU: {selectedVariant?.sku}</h3>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div style={{ color: "yellow" }}>
                    <i className="fas fa-star"> </i>
                    <i className="fas fa-star"> </i>
                    <i className="fas fa-star"> </i>
                    <i className="fas fa-star"> </i>
                    <i className="fas fa-star-half-alt"> </i>
                  </div>
                  <span className="ml-2 text-muted">
                    (10 Review(s)) |
                    <a className="text-primary" href="#">
                      {" "}
                      Add your review{" "}
                    </a>
                  </span>
                </div>
                <div className="variant-selector mt-3">
                  {product?.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`variant-btn ${
                        variant === selectedVariant ? "active" : ""
                      }`}
                      onClick={() => handleVariantChange(variant)}
                    >
                      {variant.color} - {variant.capacity}
                    </button>
                  ))}
                </div>
                <h2 className="h3 font-weight-bold mb-2">
                  {formatPrice(selectedVariant?.price ?? 0)}
                </h2>
                <div className="text-success font-weight-bold mb-4">
                  IN STOCK
                </div>
                <div className="product-options">
                  <label>
                    Dung lượng:{" "}
                    <span className="ms-2">{selectedVariant?.capacity}</span>
                  </label>
                  <label>
                    Màu sắc:{" "}
                    <span className="ms-2">{selectedVariant?.color}</span>
                  </label>
                </div>

                <div className="add-to-cart">
                  <div className="qty-label">
                    <span className="me-2">Số lượng: </span>
                    <div className="input-number">
                      <input type="number" value={quantity} readOnly />
                      <span className="qty-up" onClick={increaseQuantity}>
                        +
                      </span>
                      <span className="qty-down" onClick={decreaseQuantity}>
                        -
                      </span>
                    </div>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product?._id)}
                  >
                    <i className="fa fa-shopping-cart" /> add to cart
                  </button>
                </div>
              </div>
            </div>
            {/* Product tab */}
            <div className="col-md-12">
              <div id="product-tab">
                {/* product tab nav */}
                <ul className="tab-nav">
                  <li className={activeTab === "tab01" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab01")}>Description</a>
                  </li>
                  <li className={activeTab === "tab02" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab02")}>Details</a>
                  </li>
                  <li className={activeTab === "tab03" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab03")}>Reviews (3)</a>
                  </li>
                </ul>
                {/* /product tab nav */}
                {/* product tab content */}
                <div className="tab-content">
                  {/* Tab 1: Description */}
                  <div
                    id="tab01"
                    className={`tab-pane ${
                      activeTab === "tab01" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <p>{product?.short_description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tab 2: Details */}
                  <div
                    id="tab02"
                    className={`tab-pane ${
                      activeTab === "tab02" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <p>{product?.long_description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tab 3: Reviews */}
                  <div
                    id="tab03"
                    className={`tab-pane ${
                      activeTab === "tab03" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      {/* Rating */}
                      <div className="col-md-3">
                        <div id="rating">
                          <div className="rating-avg">
                            <span>4.5</span>
                            <div className="rating-stars">
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star-o" />
                            </div>
                          </div>
                          <ul className="rating">
                            <li>
                              <div className="rating-stars">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                              <div className="rating-progress">
                                <div style={{ width: "80%" }} />
                              </div>
                              <span className="sum">3</span>
                            </li>
                            <li>
                              <div className="rating-stars">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star-o" />
                              </div>
                              <div className="rating-progress">
                                <div style={{ width: "60%" }} />
                              </div>
                              <span className="sum">2</span>
                            </li>
                            <li>
                              <div className="rating-stars">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                              </div>
                              <div className="rating-progress">
                                <div />
                              </div>
                              <span className="sum">0</span>
                            </li>
                            <li>
                              <div className="rating-stars">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                              </div>
                              <div className="rating-progress">
                                <div />
                              </div>
                              <span className="sum">0</span>
                            </li>
                            <li>
                              <div className="rating-stars">
                                <i className="fa fa-star" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                                <i className="fa fa-star-o" />
                              </div>
                              <div className="rating-progress">
                                <div />
                              </div>
                              <span className="sum">0</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* /Rating */}
                      {/* Reviews */}
                      <div className="col-md-6">
                        <div id="reviews">
                          <ul className="reviews">
                            <li>
                              <div className="review-heading">
                                <h5 className="name">John</h5>
                                <p className="date">27 DEC 2018, 8:0 PM</p>
                                <div className="review-rating">
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star-o empty" />
                                </div>
                              </div>
                              <div className="review-body">
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="review-heading">
                                <h5 className="name">John</h5>
                                <p className="date">27 DEC 2018, 8:0 PM</p>
                                <div className="review-rating">
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star-o empty" />
                                </div>
                              </div>
                              <div className="review-body">
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="review-heading">
                                <h5 className="name">John</h5>
                                <p className="date">27 DEC 2018, 8:0 PM</p>
                                <div className="review-rating">
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star-o empty" />
                                </div>
                              </div>
                              <div className="review-body">
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua
                                </p>
                              </div>
                            </li>
                          </ul>
                          <ul className="reviews-pagination">
                            <li className="active">1</li>
                            <li>
                              <a href="#">2</a>
                            </li>
                            <li>
                              <a href="#">3</a>
                            </li>
                            <li>
                              <a href="#">4</a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa fa-angle-right" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* /Reviews */}
                      {/* Review Form */}
                      <div className="col-md-3">
                        <div id="review-form">
                          <form className="review-form">
                            <input
                              className="input"
                              type="text"
                              placeholder="Your Name"
                            />
                            <input
                              className="input"
                              type="email"
                              placeholder="Your Email"
                            />
                            <textarea
                              className="input"
                              placeholder="Your Review"
                              defaultValue={""}
                            />
                            <div className="input-rating">
                              <span>Your Rating: </span>
                              <div className="stars">
                                <input
                                  id="star5"
                                  name="rating"
                                  defaultValue={5}
                                  type="radio"
                                />
                                <label htmlFor="star5" />
                                <input
                                  id="star4"
                                  name="rating"
                                  defaultValue={4}
                                  type="radio"
                                />
                                <label htmlFor="star4" />
                                <input
                                  id="star3"
                                  name="rating"
                                  defaultValue={3}
                                  type="radio"
                                />
                                <label htmlFor="star3" />
                                <input
                                  id="star2"
                                  name="rating"
                                  defaultValue={2}
                                  type="radio"
                                />
                                <label htmlFor="star2" />
                                <input
                                  id="star1"
                                  name="rating"
                                  defaultValue={1}
                                  type="radio"
                                />
                                <label htmlFor="star1" />
                              </div>
                            </div>
                            <button className="primary-btn">Submit</button>
                          </form>
                        </div>
                      </div>
                      {/* /Review Form */}
                    </div>
                  </div>
                </div>

                {/* /product tab content  */}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="col-md-12 mb-5">
            <div className="section-title">
              <h3 className="title">Sản phẩm cùng danh mục</h3>
            </div>
            <Slider {...sliderSettings} className="products-slick">
              {relatedProducts.map((item) => (
                <div key={item._id} className="product">
                  <div className="product-img">
                    <Link className="img" to={`/product/${item._id}`}>
                      <img src={item.images[0]} alt={item.name} />
                    </Link>
                  </div>
                  <div className="product-body">
                    <h5 className="product-name">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </h5>
                    <div>
                      <h4 className="product-price">
                        {formatPrice(item.variants[0].price)}
                      </h4>
                      <div className="product-btns">
                        <button className="add-to-wishlist">
                          <i className="fa fa-heart-o" />
                          <span className="tooltipp">Thêm yêu thích</span>
                        </button>
                        {/* <button className="add-to-compare">
                            <i className="fa fa-exchange" />
                            <span className="tooltipp">add to compare</span>
                          </button> */}
                        <button className="quick-view">
                          <Link to={`/product/${item._id}`}>
                            <i className="fa fa-eye" />
                          </Link>
                          <span className="tooltipp">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Add to Cart button - hidden initially */}
                  <div className="add-to-cart">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      <i className="fa fa-shopping-cart" /> Thêm giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Custom Slider Controls BELOW and RIGHT */}
            <div className="custom-slider-controls">
              <button
                className="custom-prev-btn"
                onClick={() => productDetailSliderRef.current?.slickPrev()}
              >
                ❮
              </button>
              <button
                className="custom-next-btn"
                onClick={() => productDetailSliderRef.current?.slickNext()}
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Shop Detail End */}
    </>
  );
};

export default ProductDetail;
