import React, { useEffect, useRef, useState, useContext } from "react";
import { getProductById, Product } from "../../services/product";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import toast from "react-hot-toast";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProductPolling } from "../../hooks/useProductPolling";
import { CartContext } from "../../context/CartContext"; // Import CartContext

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext); // Use CartContext
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][0] | null
  >(null);
  const [activeTab, setActiveTab] = useState("tab01");
  const [isBanned, setIsBanned] = useState(false);
  const productDetailSliderRef = useRef<Slider | null>(null);

  // Sử dụng custom hook cho polling
  useProductPolling(
    id,
    product,
    setProduct,
    setRelatedProducts,
    selectedVariant,
    setSelectedVariant
  );

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const imageSliderSettings = {
    slidesToShow: 10,
    slidesToScroll: 1,
    autoplay: false,
    infinite: false,
    speed: 300,
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 8,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          infinite: false,
        },
      },
    ],
  };

  const productSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: true,
        },
      },
    ],
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const { data } = await getProductById(id!);
        setProduct(data.data);
        setRelatedProducts(data.relatedProducts);
        setMainImage(data.data.images[0]);

        if (data.data.status === "banned") {
          setIsBanned(true);
          toast.error("Sản phẩm này hiện không khả dụng");
        } else {
          setIsBanned(false);
          if (data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          }
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
        }
      }
    })();
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const handleVariantChange = (variant: Product["variants"][0]) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="product-detail-page">
      {/* BREADCRUMB */}
      <div id="breadcrumb" className="section">
        <div className="container">
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
        </div>
      </div>

      {/* Shop Detail Start */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="product-images">
                <div className="main-image">
                  <img src={mainImage!} alt={product?.name} />
                </div>
                <div className="thumbnail-slider">
                  <Slider {...imageSliderSettings} ref={productDetailSliderRef}>
                    {product?.images.map((img, index) => (
                      <div
                        key={index}
                        className={`thumbnail-item ${
                          img === mainImage ? "active" : ""
                        }`}
                        onClick={() => setMainImage(img)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="product-details">
                {isBanned ? (
                  <h2 className="text-danger">Sản phẩm hiện không khả dụng</h2>
                ) : (
                  <>
                    <h3 className="h3 font-weight-bold">{product?.name}</h3>
                    <h3 className="h5 mt-2">SKU: {selectedVariant?.sku}</h3>

                    <div className="d-flex align-items-center mb-2">
                      <div style={{ color: "yellow" }}>
                        <i className="fas fa-star"> </i>
                        <i className="fas fa-star"> </i>
                        <i className="fas fa-star"> </i>
                        <i className="fas fa-star"> </i>
                        <i className="fas fa-star-half-alt"> </i>
                      </div>
                      <span className="ml-2 text-muted">
                        (10 Đánh giá) |
                        <a className="text-primary" href="#">
                          {" "}
                          Đánh giá{" "}
                        </a>
                      </span>
                    </div>

                    <div className="variant-selector">
                      <div className="variant-options">
                        <h4>Chọn phiên bản</h4>
                        <div className="variant-list">
                          {product?.variants.map((variant, index) => (
                            <button
                              key={index}
                              className={`variant-btn ${
                                variant === selectedVariant ? "active" : ""
                              }`}
                              onClick={() => handleVariantChange(variant)}
                              disabled={variant.stock <= 0}
                            >
                              <div className="variant-content">
                                <span
                                  className="color-dot"
                                  style={{
                                    backgroundColor:
                                      typeof variant.color === "string"
                                        ? variant.color
                                        : variant.color.name,
                                  }}
                                />
                                <span className="variant-text">
                                  {typeof variant.color === "string"
                                    ? variant.color
                                    : variant.color.name}
                                  {" - "}
                                  {typeof variant.capacity === "string"
                                    ? variant.capacity
                                    : variant.capacity.value}
                                  {variant.stock <= 0 && " (Hết hàng)"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <h2 className="h3 font-weight-bold mb-2 product-price">
                      {formatPrice(selectedVariant?.salePrice ?? 0)}
                      <br />
                      {selectedVariant?.salePrice !==
                        selectedVariant?.price && (
                        <del className="product-old-price">
                          {formatPrice(selectedVariant?.price ?? 0)}
                        </del>
                      )}
                    </h2>

                    <div
                      className={`font-weight-bold mb-4 ${
                        selectedVariant?.stock > 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {selectedVariant?.stock > 0 ? "CÒN HÀNG" : "HẾT HÀNG"}:{" "}
                      {selectedVariant?.stock}
                    </div>

                    <div className="product-options">
                      <label>
                        Dung lượng:{" "}
                        <span className="ms-2">
                          {typeof selectedVariant?.capacity === "string"
                            ? selectedVariant.capacity
                            : selectedVariant?.capacity.value}
                        </span>
                      </label>
                      <label>
                        Màu sắc:{" "}
                        <span className="ms-2">
                          {typeof selectedVariant?.color === "string"
                            ? selectedVariant.color
                            : selectedVariant?.color.name}
                        </span>
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
                        onClick={() =>
                          addToCart(product?._id, selectedVariant, quantity)
                        } // Use context addToCart
                      >
                        <i className="fa fa-shopping-cart" /> Thêm giỏ hàng
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product tab */}
            <div className="col-md-12">
              <div id="product-tab">
                <ul className="tab-nav">
                  <li className={activeTab === "tab01" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab01")}>Mô tả</a>
                  </li>
                  <li className={activeTab === "tab02" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab02")}>Chi tiết</a>
                  </li>
                  <li className={activeTab === "tab03" ? "active" : ""}>
                    <a onClick={() => handleTabClick("tab03")}>Đánh giá (3)</a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    id="tab01"
                    className={`tab-pane ${
                      activeTab === "tab01" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: product?.short_description || "",
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>

                  <div
                    id="tab02"
                    className={`tab-pane ${
                      activeTab === "tab02" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: product?.long_description || "",
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>

                  <div
                    id="tab03"
                    className={`tab-pane ${
                      activeTab === "tab03" ? "active" : "fade"
                    }`}
                  >
                    <div className="row">
                      <div className="col-md-3">
                        <div id="rating">
                          <div className="rating-avg">
                            <span>4.5</span>
                            <div className="rating-stars">
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star-half-alt" />
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
                                  incididunt ut labore et dolore magna aliqua.
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
                    </div>
                  </div>
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
                {...productSliderSettings}
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
                          {formatPrice(item.variants[0].salePrice)}
                          <br />
                          {item.variants[0]?.salePrice !==
                            item.variants[0]?.price && (
                            <del className="product-old-price">
                              {formatPrice(item.variants[0]?.price ?? 0)}
                            </del>
                          )}
                        </h4>
                        <div className="product-btns">
                          <button className="add-to-wishlist">
                            <i className="fa fa-heart-o" />
                            <span className="tooltipp">Thêm yêu thích</span>
                          </button>
                          <button className="quick-view">
                            <Link to={`/product/${item._id}`}>
                              <i className="fa fa-eye" />
                            </Link>
                            <span className="tooltipp">Xem chi tiết</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="add-to-cart">
                      <button
                        className="add-to-cart-btn"
                        onClick={() =>
                          addToCart(item._id, item.variants?.[0], 1)
                        } // Use context addToCart for related products
                      >
                        <i className="fa fa-shopping-cart" /> Thêm giỏ hàng
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>

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
      </div>
    </div>
  );
};

export default ProductDetail;
