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
    window.scrollTo(0, 0);
    (async () => {
      const { data } = await getProductById(id!);
      setProduct(data.data);
      setRelatedProducts(data.relatedProducts);
      setMainImage(data.data.images[0]);

      if (data.data.variants.length > 0) {
        setSelectedVariant(data.data.variants[0]);
      }
    })();
  }, [id]);

  const addToCart = async (productId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return nav("/login");
      }

      if (!productId) {
        toast.error("Sản phẩm không hợp lệ!");
        return;
      }

      const selectedProduct = relatedProducts.find(p => p._id === productId) || product;

      if (!selectedProduct) {
        toast.error("Không tìm thấy sản phẩm!");
        return;
      }

      const cartItem: Carts = {
        userId: user._id,
        items: [
          {
            productId: selectedProduct._id,
            variantId: selectedVariant._id,
            quantity: quantity,
          },
        ],
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

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
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
          </div>
          <div className="col-lg-7 pb-5">
            <h3 className="h4 font-weight-bold">{product?.name}</h3>
            <div className="d-flex align-items-center mb-2">
              <div className="text-danger">
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
            <h2 className="h3 text-danger font-weight-bold mb-2">
              {formatPrice(product?.price ?? 0)}
            </h2>
            <div className="text-success font-weight-bold mb-4">IN STOCK</div>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="product-options">
              <div className="row align-items-center mb-3">
                <div className="col-auto">
                  <label className="form-label fw-bold">Dung Lượng</label>
                </div>
                <div className="col-auto">
                  <select className="form-select form-select-sm w-auto border-dark">
                    <option value="0">64GB</option>
                    <option value="1">128GB</option>
                    <option value="2">256GB</option>
                  </select>
                </div>
                <div className="col-auto">
                  <label className="form-label fw-bold">Màu Sắc</label>
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
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="tab-pane-1">
                <h4 className="mb-3">Additional Information</h4>
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
              <div className="tab-pane fade" id="tab-pane-2">
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

                  {/* Tab 2: Details */}
                  <div
                    id="tab02"
                    className={`tab-pane ${activeTab === "tab02" ? "active" : "fade"
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
                    className={`tab-pane ${activeTab === "tab03" ? "active" : "fade"
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
          <div className="col-md-12 mb-5 mt-5">
            <div className="section-title">
              <h3 className="title d-flex justify-content-center">
                Sản phẩm cùng danh mục
              </h3>
            </div>
            <Slider
              ref={productDetailSliderRef}
              {...sliderSettings}
              className="products-slick"
            >
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
                      onClick={() => addToCart(item._id)}
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
