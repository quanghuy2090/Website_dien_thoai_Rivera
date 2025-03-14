import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getAllProduct, Product } from "../../services/product";
import { addCart, Carts } from "../../services/cart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/style.css";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsPerPage] = useState<number>(6);
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectdCategory] =
    useState<string>("Tất cả sản phẩm");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number] | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const nav = useNavigate();
  const categories = [
    "Tất cả sản phẩm",
    ...new Set(
      products.map((p) => (p.categoryId?.name ? p.categoryId?.name : "Unknown"))
    ),
  ];
  const priceRanger: [number, number][] = [
    [3000000, 5000000],
    [5000000, 10000000],
    [10000000, 20000000],
    [20000000, 30000000],
    [30000000, 40000000],
  ];

  const filteredProducts = products.filter((p) => {
    // Kiểm tra nếu sản phẩm thuộc danh mục được chọn
    const categoryMatch =
      selectedCategory === "Tất cả sản phẩm" ||
      p.categoryId?.name === selectedCategory;

    // Kiểm tra nếu sản phẩm có chứa từ khóa tìm kiếm
    const searchMatch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Kiểm tra nếu sản phẩm nằm trong khoảng giá đã chọn
    const priceMatch = selectedPriceRange
      ? p.variants[0].price >= selectedPriceRange[0] &&
      p.variants[0].price <= selectedPriceRange[1]
      : true;
    return categoryMatch && searchMatch && priceMatch;
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProduct();
        setProducts(res.data.data);
      } catch (error) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setDropdownOpen(false);
    // Add sorting logic here if needed
  };

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
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
                <li className="active">Sản phẩm</li>
              </ul>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* /BREADCRUMB */}
      {/* SECTION */}
      <div className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            {/* ASIDE */}
            <div id="aside" className="col-md-3">
              {/* aside Widget */}
              <div className="aside">
                <h3 className="aside-title">Thương hiệu</h3>
                <div className="checkbox-filter">
                  {categories.map((category) => (
                    <div key={category} className="input-checkbox">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategory === category} // Kiểm tra nếu category được chọn
                        onChange={() => setSelectdCategory(category)} // Cập nhật danh mục khi chọn
                      />
                      <label htmlFor={`category-${category}`}>
                        <span></span>
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* /aside Widget */}
              {/* aside Widget */}
              <div className="aside">
                <h3 className="aside-title">Lọc theo giá</h3>
                <div className="checkbox-filter">
                  {priceRanger.map(([min, max], index) => (
                    <div key={index} className="input-checkbox">
                      <input
                        type="checkbox"
                        id={`price-${index}`}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPriceRange([min, max]); // Chọn khoảng giá
                          } else {
                            setSelectedPriceRange(null); // Bỏ chọn => Hiển thị tất cả
                          }
                        }}
                        checked={
                          selectedPriceRange?.[0] === min &&
                          selectedPriceRange?.[1] === max
                        }
                      />
                      <label htmlFor={`price-${index}`}>
                        <span></span>
                        {min.toLocaleString()} - {max.toLocaleString()} VND
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* /aside Widget */}
            </div>
            {/* /ASIDE */}
            {/* STORE */}
            <div id="store" className="col-md-9">
              {/* store top filter */}
              <div className="store-filter clearfix">
                <div className="store-sort">
                  <div className="row">
                    <div className="col">
                      <label>
                        Sort By:
                        <select className="ms-2 input-select">
                          <option value={0}>Popular</option>
                          <option value={1}>Position</option>
                        </select>
                      </label>
                    </div>
                    <div className="col">
                      <form action="">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm sản phẩm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text bg-transparent text-primary">
                              <i className="fa fa-search" />
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <ul className="store-grid">
                  <li className="active">
                    <i className="fa fa-th" />
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-th-list" />
                    </a>
                  </li>
                </ul>
              </div>
              {/* /store top filter */}
              {/* store products */}
              <div className="row">
                {/* product */}
                {loading ? (
                  <div className="col-12 text-center">Loading products...</div>
                ) : (
                  currentProducts.map((product) => (
                    <div key={product._id} className="col-md-4 col-xs-6 mb-3">
                      <div className="product">
                        <div className="product-img">
                          <Link className="img" to={`/product/${product._id}`}>
                            <img src={product.images[0]} alt={product.name} />
                          </Link>
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
                        {/* Add to Cart button */}
                        <div className="add-to-cart">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product)}
                          >
                            <i className="fa fa-shopping-cart" /> Thêm giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* /product */}
                <div className="store-filter clearfix">
                  {/* <span className="store-qty">Showing 20-100 products</span> */}
                  <ul className="store-pagination">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        href="#"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">«</span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""
                          }`}
                      >
                        <a
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                          href="#"
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        href="#"
                        aria-label="Next"
                      >
                        <span aria-hidden="true">»</span>
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Pagination */}
                <div className="col-12 pb-1">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center mb-3">

                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          {/* Shop Product Start */}
          <div className="col-lg-9 col-md-12">
            <div className="row pb-3"></div>
          </div>
          {/* Shop Product End */}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
