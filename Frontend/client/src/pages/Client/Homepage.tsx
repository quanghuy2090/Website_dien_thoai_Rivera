import { useEffect, useState, useRef } from "react";
import { getAllProduct, Product } from "../../services/product";
import { addCart, Carts } from "../../services/cart";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/style.css";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const nav = useNavigate();
  const productSliderRef = useRef<Slider | null>(null); // Ref for the first slider
  const hotDealSliderRef = useRef<Slider | null>(null); // Ref for the second slider

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
    };
    fetchProducts();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!", {});
        nav("/login");
        return;
      }
      const cart: Carts = {
        _id: "",
        userId: user._id,
        quantity: 1,
        productId: product._id,
      };
      const { data } = await addCart(cart);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Error");
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  // Slick Slider Settings
  const sliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Disable auto-slide to allow manual control
    infinite: true,
    speed: 300,
    dots: false,
    arrows: false, // Hide default arrows, we'll use custom buttons
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

  return (
    <>
      {/* Product Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm mới ra mắt</h3>
              </div>
            </div>

            <div className="col-md-12">
              <Slider
                ref={productSliderRef} // Pass the productSliderRef
                {...sliderSettings}
                className="products-slick"
              >
                {products.map((product) => (
                  <div className="product" key={product._id}>
                    <div className="product-img mt-3">
                      <Link className="img" to={`/product/${product._id}`}>
                        <img src={product.images[0]} alt={product.name} />
                      </Link>
                      <div className="product-label">
                        <span className="new">NEW</span>
                      </div>
                    </div>
                    <div className="product-body">
                      <h3 className="product-name">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                      </h3>
                      <div>
                        <h4 className="product-price">
                          {formatPrice(product.price)}
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
                            <Link to={`/product/${product._id}`}>
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
                        onClick={() => addToCart(product)}
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
                  onClick={() => productSliderRef.current?.slickPrev()}
                >
                  ❮
                </button>
                <button
                  className="custom-next-btn"
                  onClick={() => productSliderRef.current?.slickNext()}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOT DEAL SECTION */}
      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li>
                    <div>
                      <h3>02</h3>
                      <span>Days</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>10</h3>
                      <span>Hours</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>34</h3>
                      <span>Mins</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>60</h3>
                      <span>Secs</span>
                    </div>
                  </li>
                </ul>
                <h2 className="text-uppercase">hot deal this week</h2>
                <p>New Collection Up to 50% OFF</p>
                <a className="primary-btn cta-btn" href="#">
                  Shop now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Deal Slider */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Slider
                ref={hotDealSliderRef} // Pass the hotDealSliderRef
                {...sliderSettings}
                className="products-slick"
              >
                {products.map((product) => (
                  <div className="product" key={product._id}>
                    <div className="product-img mt-3">
                      <Link className="img" to={`/product/${product._id}`}>
                        <img src={product.images[0]} alt={product.name} />
                      </Link>
                      <div className="product-label">
                        <span className="new">HOT</span>
                      </div>
                    </div>
                    <div className="product-body">
                      <h3 className="product-name">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                      </h3>
                      <div>
                        <h4 className="product-price">
                          {formatPrice(product.price)}
                        </h4>
                        <div className="product-btns">
                          <button className="add-to-wishlist">
                            <i className="fa fa-heart-o" />
                            <span className="tooltipp">Thêm yêu thích</span>
                          </button>
                          <button className="quick-view">
                            <Link to={`/product/${product._id}`}>
                              <i className="fa fa-eye" />
                            </Link>
                            <span className="tooltipp">Xem chi tiết</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <div className="add-to-cart">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fa fa-shopping-cart" /> Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* Custom Slider Controls BELOW and RIGHT */}
              <div className="custom-slider-controls">
                <button
                  className="custom-prev-btn"
                  onClick={() => hotDealSliderRef.current?.slickPrev()}
                >
                  ❮
                </button>
                <button
                  className="custom-next-btn"
                  onClick={() => hotDealSliderRef.current?.slickNext()}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default HomePage;
