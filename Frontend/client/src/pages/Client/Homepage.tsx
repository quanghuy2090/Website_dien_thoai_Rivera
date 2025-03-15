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
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const nav = useNavigate();
  const productSliderRef = useRef<Slider | null>(null); // Ref for the first slider
  const hotDealSliderRef = useRef<Slider | null>(null); // Ref for the second slider

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProduct();
      const allProducts = res.data.data;

      // Get current date and subtract 1 month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Filter products created within the last month
      const recentProducts = allProducts.filter((product: Product) => {
        const createdAtDate = new Date(product.createdAt);
        return createdAtDate >= oneMonthAgo;
      });

      const bestSellingProducts = allProducts.filter((product: Product) => product.is_hot === "yes");

      setNewProducts(recentProducts);
      setHotProducts(bestSellingProducts);
    };
    fetchProducts();
  }, []);
  const addToCart = async (product: Product) => {
    try {
      // Lấy thông tin user từ localStorage
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

      if (!user || !user._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        nav("/login");
        return;
      }

      // Kiểm tra xem sản phẩm có biến thể không
      if (!product.variants || product.variants.length === 0) {
        toast.error("Sản phẩm này không có biến thể hợp lệ!");
        return;
      }

      // Chọn biến thể đầu tiên làm mặc định hoặc để người dùng chọn
      const selectedVariant = product.variants[0]; // Cần thay đổi nếu cho phép chọn biến thể

      // Chuẩn bị dữ liệu giỏ hàng theo đúng format `Carts`
      const cart: Carts = {
        userId: user._id,
        items: [
          {
            productId: product._id,
            variantId: selectedVariant._id, // Lấy `variantId` từ `product.variants`
            quantity: 1,
          },
        ],
      };

      // Gửi request lên API
      const { data } = await addCart(cart);
      console.log("API Response:", data); // Log response để kiểm tra

      // Thông báo thành công
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");


    } catch (error) {
      // console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };


  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  // Slick Slider Settings
  const sliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
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
      {/* Banner SECTION */}
      <div id="banner-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="banner-deal"></div>
            </div>
          </div>
        </div>
      </div>

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
                {newProducts.map((product) => (
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
                      <p className="product-category">
                        {typeof product.categoryId === "object" &&
                          product.categoryId !== null
                          ? product.categoryId.name
                          : product.categoryId}
                      </p>
                      <h3 className="product-name">
                        <Link to={`/product/${product._id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <div>
                        <h4 className="product-price">
                          {formatPrice(product.variants[0].price)}
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
              <div className="hot-deal"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Deal Slider */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm bán chạy</h3>
              </div>
            </div>
            <div className="col-md-12">
              <Slider
                ref={hotDealSliderRef} // Pass the hotDealSliderRef
                {...sliderSettings}
                className="products-slick"
              >
                {hotProducts.map((product) => (
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
                      <p className="product-category">
                        {typeof product.categoryId === "object" &&
                          product.categoryId !== null
                          ? product.categoryId.name
                          : product.categoryId}
                      </p>
                      <h3 className="product-name">
                        <Link to={`/product/${product._id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <div>
                        <h4 className="product-price">
                          {formatPrice(product.variants[0].price)}
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
      {/* NEWSLETTER */}
      <div id="newsletter" className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            <div className="col-md-12">
              <div className="newsletter">
                <p>
                  Sign Up for the <strong>NEWSLETTER</strong>
                </p>
                <form>
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter Your Email"
                  />
                  <button className="newsletter-btn">
                    <i className="fa fa-envelope" /> Subscribe
                  </button>
                </form>
                <ul className="newsletter-follow">
                  <li>
                    <a href="#">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-pinterest" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* /NEWSLETTER */}
    </>
  );
};

export default HomePage;
