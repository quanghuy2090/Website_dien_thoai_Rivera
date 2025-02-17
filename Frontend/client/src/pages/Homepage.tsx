import { useEffect, useState } from "react";
import { getAllProduct, Product } from "../services/product";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { addCart, Cart } from "../services/cart";
import toast from "react-hot-toast";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(3);
  const [fade, setFade] = useState<boolean>(false); // State for fade effect

  useEffect(() => {
    (async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
    })();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle next and previous
  const handleNext = () => {
    if (currentPage < totalPages) {
      setFade(true); // Start fade out
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setFade(false); // Reset fade after changing page
      }, 500); // Match the duration of your CSS transition
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setFade(true); // Start fade out
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setFade(false); // Reset fade after changing page
      }, 500); // Match the duration of your CSS transition
    }
  };

  const addToCart = async (product: Product) => {
    try {

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        });
        return;
      }
      const cart: Cart = {
        _id: "", // Backend tự tạo `_id`
        product: product,
        userId: user._id, // Chỉ lấy `_id` của user
        quantity: 1,
        productId: product._id, // Đảm bảo có productId
      };

      // 🛠 Gửi request thêm vào giỏ hàng
      const { data } = await addCart(cart);

      // 🎉 Hiển thị thông báo thành công
      toast.success("Cart added successfully");

      console.log("🛒 Thêm vào giỏ hàng:", data);
    } catch (error) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Error");
    }
  };

  return (
    <div>
      <div>
        {/* TOP */}
        <div id="home-top-container">
          <div id="home-top-wrapper">
            <div id="home-top-text">
              <h1>Track Your Steps With Quality Smartwatch</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse pellentesque, ante vitae cursus elementum, lectus
                sapien auctor tortor, quis pharetra ligula sapien eu augue.
              </p>
              <button className="blue-button">See Collection</button>
            </div>
            <div id="home-top-image">
              <img src="image/topwatch.png" alt="Large Blue Smartwatch" />
            </div>
          </div>
        </div>
        {/* OUR COLLECTION/ TYPES OF PRODUCTS SELLING */}
        <div id="collection-container">
          <h1>Our Collection</h1>
          <div id="collection-items-wrapper">
            <div className="collection-item">
              <div className="collection-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  fill="currentColor"
                  className="bi bi-headphones"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5" />
                </svg>
              </div>
              <span className="collection-name">Headphone</span>
            </div>
            <div className="collection-item">
              <div className="collection-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  fill="currentColor"
                  className="bi bi-phone"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                  <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                </svg>
              </div>
              <span className="collection-name">Phone</span>
            </div>
            <div className="collection-item">
              <div className="collection-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  fill="currentColor"
                  className="bi bi-smartwatch"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 5a.5.5 0 0 0-1 0v3H6a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5z" />
                  <path d="M4 1.667v.383A2.5 2.5 0 0 0 2 4.5v7a2.5 2.5 0 0 0 2 2.45v.383C4 15.253 4.746 16 5.667 16h4.666c.92 0 1.667-.746 1.667-1.667v-.383a2.5 2.5 0 0 0 2-2.45V8h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H14v-.5a2.5 2.5 0 0 0-2-2.45v-.383C12 .747 11.254 0 10.333 0H5.667C4.747 0 4 .746 4 1.667M4.5 3h7A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3" />
                </svg>
              </div>
              <span className="collection-name">Smartwatch</span>
            </div>
            <div className="collection-item">
              <div className="collection-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  fill="currentColor"
                  className="bi bi-tablet-landscape"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm-1 8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2z" />
                  <path d="M14 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                </svg>
              </div>
              <span className="collection-name">Tablet</span>
            </div>
            <div className="collection-item">
              <div className="collection-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  fill="currentColor"
                  className="bi bi-laptop"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                </svg>
              </div>
              <span className="collection-name">PC</span>
            </div>
          </div>
        </div>{" "}
        {/* END OF PRODUCT COLLECTION*/}
        {/* BEST SELLERS – PRODUCT SECTION */}
        <div className="product-section-container">
          <h1>Best Sellers</h1>
          <span className="product-section-description">
            Lectus sapien auctor tortor quis pharetra ligula sapien eu augue.
            Praesent bibendum sapien ut est venenatis semper.
          </span>
          <ul
            className={`product-section-items-wrapper ${fade ? "fade-out" : ""
              }`}
          >
            <li>
              <button
                className="btn btn-seller rounded-circle"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="btn-icon" />
              </button>
            </li>
            {currentProducts.map((item, index) => (
              <li className="product-item" key={index}>
                <div className="product-image">
                  {item.images.length > 0 && (
                    <img src={item.images[0]} alt="" />
                  )}
                </div>
                <div className="product-text">
                  <span className="product-title">{item.name}</span>
                  <div className="product-purchase">
                    <span className="product-price">{item.price}đ</span>
                    <button
                      className="blue-button add-to-cart"
                      onClick={() => addToCart(item)}
                    >
                      Add To Cart
                    </button>

                  </div>
                </div>
              </li>
            ))}
            <li>
              <button
                className="btn btn-seller rounded-circle"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="btn-icon" />
              </button>
            </li>
          </ul>
        </div>
        {/* END OF BEST SELLERS - PRODUCT SECTION */}
        {/* IPAD PROMO */}
        <div className="promo-container">
          <div className="promo-box">
            <div className="promo-image">
              <img
                src="images/collection/ipad.png"
                alt="Candyfloss Pink Two-Earpiece Headphone"
              />
            </div>
            <div className="promo-content">
              <h1>New Arrivals</h1>
              <h2>Sunshine Ipad</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur tristique quam eget eros convallis, sit amet
                pellentesque.
              </p>
              <div>
                <button className="white-button">SHOP NOW</button>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* END OF IPAD PROMO */}
        <Footer/>
      </div>
    </div >
  );
};

export default HomePage;
