import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAllProduct, Product } from "../services/product";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsPerPage] = useState<number>(6);
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectdCategory] = useState<string>("All product");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const categories = [
    "All product",
    ...new Set(products.map((p) => (p.categoryId?.name ? p.categoryId?.name : "Unknown"))),
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
    const categoryMatch = selectedCategory === "All product" || p.categoryId?.name === selectedCategory;

    // Kiểm tra nếu sản phẩm có chứa từ khóa tìm kiếm
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Kiểm tra nếu sản phẩm nằm trong khoảng giá đã chọn
    const priceMatch = selectedPriceRange
      ? p.price >= selectedPriceRange[0] && p.price <= selectedPriceRange[1]
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
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
          <h1 className="font-weight-semi-bold text-uppercase mb-3">Our Shop</h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <Link to="/">Home</Link>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Shop</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          {/* Shop Sidebar Start */}
          <div className="col-lg-3 col-md-12">
            {/* Price Start */}
            <div className="border-bottom mb-4 pb-4">
              <h5 className="font-weight-semi-bold mb-4">Filter by product</h5>
              <form>
                {categories.map((category) => (
                  <div key={category} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`category-${category}`}
                      checked={selectedCategory === category} // Kiểm tra nếu category được chọn
                      onChange={() => setSelectdCategory(category)} // Cập nhật danh mục khi chọn
                    />
                    <label className="custom-control-label" htmlFor={`category-${category}`}>
                      {category}
                    </label>
                  </div>
                ))}
              </form>
            </div>
            {/* Price End */}

            {/* Color Start */}
            <div className="border-bottom mb-4 pb-4">
              <h5 className="font-weight-semi-bold mb-4">Filter by price</h5>
              <form>
                {priceRanger.map(([min, max], index) => (
                  <div key={index} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`price-${index}`}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPriceRange([min, max]); // Chọn khoảng giá
                        } else {
                          setSelectedPriceRange(null); // Bỏ chọn => Hiển thị tất cả
                        }
                      }}
                      checked={selectedPriceRange?.[0] === min && selectedPriceRange?.[1] === max}
                    />
                    <label className="custom-control-label" htmlFor={`price-${index}`}>
                      {min.toLocaleString()} - {max.toLocaleString()}
                    </label>
                  </div>
                ))}
              </form>
            </div>
            {/* Color End */}
          </div>
          {/* Shop Sidebar End */}

          {/* Shop Product Start */}
          <div className="col-lg-9 col-md-12">
            <div className="row pb-3">
              <div className="col-12 pb-1">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <form action="">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      <div className="input-group-append">
                        <span className="input-group-text bg-transparent text-primary">
                          <i className="fa fa-search" />
                        </span>
                      </div>
                    </div>
                  </form>
                  <div className="dropdown ml-4">
                    <button className="btn border" onClick={toggleDropdown}>
                      Sort by: {sortOption}
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu show">
                        {["Latest", "Popularity", "Best Rating"].map((option) => (
                          <a key={option} className="dropdown-item" onClick={() => handleSortChange(option)} href="#">
                            {option}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Products Rendering */}
              {loading ? (
                <div className="col-12 text-center">Loading products...</div>
              ) : (
                currentProducts.map((product) => (
                  <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 pb-1">
                    <div className="card product-item border-0 mb-4">
                      <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                        <img className="img-fluid w-100" src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                        <h6 className="text-truncate mb-3">{product.name}</h6>
                        <div className="d-flex justify-content-center">
                          <h6>${product.price}</h6>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between bg-light border">
                        <Link to={`/product/${product._id}`} className="btn btn-sm text-dark p-0">
                          <i className="fas fa-eye text-primary mr-1" />
                          View Detail
                        </Link>
                        <button className="btn btn-sm text-dark p-0">
                          <i className="fas fa-shopping-cart text-primary mr-1" />
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Pagination */}
              <div className="col-12 pb-1">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center mb-3">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <a className="page-link" onClick={() => handlePageChange(currentPage - 1)} href="#" aria-label="Previous">
                        <span aria-hidden="true">«</span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <a className="page-link" onClick={() => handlePageChange(index + 1)} href="#">
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <a className="page-link" onClick={() => handlePageChange(currentPage + 1)} href="#" aria-label="Next">
                        <span aria-hidden="true">»</span>
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          {/* Shop Product End */}
        </div>
      </div>
    </>
  );
};

export default ProductPage;