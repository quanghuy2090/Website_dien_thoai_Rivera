import { useEffect, useState, useRef } from "react";
import { getAllProduct, Product } from "../../services/product";
import { addCart, Carts } from "../../services/cart";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/style.css";
import { getCategories } from "../../services/category";

const HomePage = () => {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // const nav = useNavigate();
  const productSliderRef = useRef<Slider | null>(null); // Ref for the first slider
  const hotDealSliderRef = useRef<Slider | null>(null); // Ref for the second slider

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProduct();
        const allProducts = res.data.data;

        // Get current date and subtract 1 month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Filter products created within the last month
        const recentProducts = allProducts.filter((product: Product) => {
          const createdAtDate = new Date(product.createdAt);
          return createdAtDate >= oneMonthAgo && product.status !== "banned";
        });

        console.log("Total products:", allProducts.length);
        console.log("Recent products count:", recentProducts.length);
        console.log(
          "Recent products:",
          recentProducts.map((p) => ({
            name: p.name,
            createdAt: new Date(p.createdAt),
            status: p.status,
          }))
        );

        const bestSellingProducts = allProducts.filter(
          (product: Product) =>
            product.is_hot === "yes" && product.status !== "banned"
        );

        setNewProducts(recentProducts);
        setHotProducts(bestSellingProducts);
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Có lỗi xảy ra khi tải danh sách sản phẩm");
        }
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Có lỗi xảy ra khi tải danh mục");
        }
      }
    };
    fetchCategories();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      if (product.status === "banned") {
        toast.error("Sản phẩm này hiện không khả dụng");
        return;
      }

      const selectedVariant = product.variants?.[0];
      if (!selectedVariant) {
        toast.error("Sản phẩm không có biến thể hợp lệ!");
        return;
      }

      if (selectedVariant.stock <= 0) {
        toast.error("Sản phẩm đã hết hàng!");
        return;
      }

      const cartItem: Carts = {
        userId: user._id,
        productId: product._id,
        variantId: selectedVariant._id,
        quantity: 1,
        price: selectedVariant.price,
        salePrice: selectedVariant.salePrice,
        color:
          typeof selectedVariant.color === "object"
            ? selectedVariant.color.name
            : selectedVariant.color,
        capacity:
          typeof selectedVariant.capacity === "object"
            ? selectedVariant.capacity.value
            : selectedVariant.capacity,
        subtotal: selectedVariant.salePrice * 1,
      };

      const response = await addCart(cartItem);
      toast.success(
        response.data.message || "Sản phẩm đã được thêm vào giỏ hàng!"
      );
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
      }
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
                      {product.variants[0].sale > 0 && ( // Conditional rendering
                        <div className="product-label2">
                          <span className="new">
                            {product.variants[0].sale}%
                          </span>
                        </div>
                      )}
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
                          {formatPrice(product.variants[0].salePrice)}
                          <br />
                          {product.variants[0]?.salePrice !==
                            product.variants[0]?.price && (
                            <del className="product-old-price">
                              {formatPrice(product.variants[0]?.price ?? 0)}
                            </del>
                          )}
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
                      {product.variants[0].sale > 0 && ( // Conditional rendering
                        <div className="product-label2">
                          <span className="new">
                            {product.variants[0].sale}%
                          </span>
                        </div>
                      )}
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
                          {formatPrice(product.variants[0].salePrice)}
                          <br />
                          {product.variants[0]?.salePrice !==
                            product.variants[0]?.price && (
                            <del className="product-old-price">
                              {formatPrice(product.variants[0]?.price ?? 0)}
                            </del>
                          )}
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

      {/* Trending Categories Section */}
      {/* <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Danh mục nổi bật</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="trending-categories">
                <div className="row">
                  <div className="col-md-3 col-sm-6">
                    <div className="category-card">
                      <div className="category-img">
                        <img
                          src="/images/categories/smartphone.jpg"
                          alt="Smartphone"
                        />
                      </div>
                      <div className="category-content">
                        <h4>Smartphone</h4>
                        <p>Khám phá các mẫu điện thoại mới nhất</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="category-card">
                      <div className="category-img">
                        <img src="/images/categories/tablet.jpg" alt="Tablet" />
                      </div>
                      <div className="category-content">
                        <h4>Tablet</h4>
                        <p>Máy tính bảng đa dạng mẫu mã</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="category-card">
                      <div className="category-img">
                        <img
                          src="/images/categories/accessories.jpg"
                          alt="Phụ kiện"
                        />
                      </div>
                      <div className="category-content">
                        <h4>Phụ kiện</h4>
                        <p>Phụ kiện chính hãng chất lượng cao</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="category-card">
                      <div className="category-img">
                        <img
                          src="/images/categories/smartwatch.jpg"
                          alt="Đồng hồ thông minh"
                        />
                      </div>
                      <div className="category-content">
                        <h4>Đồng hồ thông minh</h4>
                        <p>Đồng hồ thông minh đa tính năng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Featured Categories Section */}
      {/* <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Thương hiệu nổi bật</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="brands-slider">
                {categories.map((category) => (
                  <div className="brand-item" key={category._id}>
                    <Link to={`/category/${category.slug}`}>
                      <h4>{category.name}</h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Featured Brands Section */}
      {/* <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Thương hiệu nổi bật</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="brands-slider">
                <div className="brand-item">
                  <img src="/images/brands/apple.png" alt="Apple" />
                </div>
                <div className="brand-item">
                  <img src="/images/brands/samsung.png" alt="Samsung" />
                </div>
                <div className="brand-item">
                  <img src="/images/brands/xiaomi.png" alt="Xiaomi" />
                </div>
                <div className="brand-item">
                  <img src="/images/brands/oppo.png" alt="OPPO" />
                </div>
                <div className="brand-item">
                  <img src="/images/brands/vivo.png" alt="Vivo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Customer Reviews Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Đánh giá từ khách hàng</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="reviews-slider">
                <div className="review-card">
                  <div className="review-header">
                    {/* <div className="review-avatar">
                      <img src="/images/avatars/user1.jpg" alt="User" />
                    </div> */}
                    <div className="review-info">
                      <h5>Nguyễn Văn A</h5>
                      <div className="review-rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>
                      "Sản phẩm chất lượng, giao hàng nhanh chóng. Tôi rất hài
                      lòng với dịch vụ của cửa hàng."
                    </p>
                  </div>
                </div>
                <div className="review-card">
                  <div className="review-header">
                    {/* <div className="review-avatar">
                      <img src="/images/avatars/user2.jpg" alt="User" />
                    </div> */}
                    <div className="review-info">
                      <h5>Trần Thị B</h5>
                      <div className="review-rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-half-o"></i>
                      </div>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>
                      "Nhân viên tư vấn nhiệt tình, sản phẩm đúng như mô tả. Sẽ
                      tiếp tục ủng hộ cửa hàng."
                    </p>
                  </div>
                </div>
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
                  Đăng ký dể trở thành <strong>Thành viên mới</strong> !
                </p>
                <form>
                  <input
                    className="input"
                    type="email"
                    placeholder="Điền email"
                  />
                  <button className="newsletter-btn">
                    <i className="fa fa-envelope" /> Đăng ký
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
