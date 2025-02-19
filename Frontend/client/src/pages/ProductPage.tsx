import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAllProduct, Product } from "../services/product";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(4); // Adjust the number of products per page as needed

  useEffect(() => {
    (async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
      setLoading(false);
    })();
  }, []);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div id="product-page-body">
        {/* TOP SECTION */}
        <div id="product-top-container">
          <div id="product-top-wrapper">
            <div id="product-top-text-section">
              <h1>Latest Trending</h1>
              <h2> Wireless Headphones</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                semper diam nisl, a pharetra nibh scelerisque quis. Ante ipsum
                vestibulum primis in faucibus orci luctuc et ultrices posuere.
              </p>
              <button className="blue-button">Shop Now</button>
            </div>
            <div id="product-top-image-section">
              <img
                src="images/product-page/top-headphones.png"
                alt="Large Light Beige Headphones"
              />
            </div>
          </div>
        </div>{" "}
        {/* END OF TOP SECTION */}
        {/* PRODUCT CATEGORIES */}
        <div id="product-category-container">
          <div id="product-category-text">
            <span className="blue-line" />
            <span className="section-category-text">Categories</span>
          </div>
          <div id="product-category-wrapper">
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/all.png"
                  alt="Image Collection Containing All Categories"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">All</span>
                <span className="product-category-number">60 items</span>
              </div>
            </div>
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/headphone.png"
                  alt="Image Collection Containing Headphones"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">Headphones</span>
                <span className="product-category-number">12 items</span>
              </div>
            </div>
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/watch.png"
                  alt="Image Collection Containing Smartwatch"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">Smartwatch</span>
                <span className="product-category-number">12 items</span>
              </div>
            </div>
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/phone.png"
                  alt="Image Collection Containing Mobile"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">Mobile</span>
                <span className="product-category-number">12 items</span>
              </div>
            </div>
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/ipad.png"
                  alt="Image Collection Containing Tablet"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">Tablet</span>
                <span className="product-category-number">12 items</span>
              </div>
            </div>
            <div className="product-category">
              <div className="product-category-image-section">
                <img
                  src="images/collection/laptop.png"
                  alt="Image Collection Containing Laptop"
                />
              </div>
              <div className="product-category-desc-section">
                <span className="product-category-type">Laptop</span>
                <span className="product-category-number">12 items</span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* END OF PRODUCT CATEGORIES */}
        {/* PRODUCT CARDS/SLIDESHOW */}
        {/* "ALL" SECTION */}
        <div className="product-section" id="product-section-all">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">All Electronics</span>
              </div>
              <h1>Explore Best Sellers</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="all"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="rgb(64, 64, 64)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="rgb(64, 64, 64)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/01.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Navy Headphones</h1>
                  <p>$87.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/03.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Turquoise Laptop</h1>
                  <p>$249.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/03.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Skyblue Phone</h1>
                  <p>$149.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/01.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Lead Tablet</h1>
                  <p>$120.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/06.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Golden Headphones</h1>
                  <p>$130.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/02.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Fire Laptop</h1>
                  <p>$219.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/01.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sandy Phone</h1>
                  <p>$135.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/02.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sandy Tablet</h1>
                  <p>$119.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/03.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Candy Headphones</h1>
                  <p>$88.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/11.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Coral Laptop</h1>
                  <p>$255.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/04.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Mauve Phone</h1>
                  <p>$189.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/03.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Lilac Tablet</h1>
                  <p>$135.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="all"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="rgb(64, 64, 64)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="rgb(64, 64, 64)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF "ALL" SECTION */}
        {/* HEADPHONES SECTION */}
        <div className="product-section" id="product-section-headphones">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">Headphones</span>
              </div>
              <h1>Discover Our Headphones</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="headphones"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/01.png"
                    alt="Navy Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Navy Headphones</h1>
                  <p>$87.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/02.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>White Headphones</h1>
                  <p>$109.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/03.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Candy Headphones</h1>
                  <p>$88.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/04.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Mauve Headphones</h1>
                  <p>$95.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/05.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Black Headphones</h1>
                  <p>$72.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/06.png"
                    alt="Golden Headphones"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Golden Headphones</h1>
                  <p>$130.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/07.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Olive Headphones</h1>
                  <p>$110.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/08.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sour Headphones</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/09.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Bubble Headphones</h1>
                  <p>$104.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/10.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Koala Headphones</h1>
                  <p>$79.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/11.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Blue Headphones</h1>
                  <p>$120.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/headphones/12.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Berry Headphones</h1>
                  <p>$68.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="headphones"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF HEADPHONES COLLECTION */}
        {/* FIRST PROMOTION SECTION */}
        <div className="promotion-section">
          <div className="promo-image-container">
            <img
              src="images/product-page/featured-categories/WATCH2.png"
              alt="Collection of Smartwatches"
            />
          </div>
          <div className="promo-text-container">
            <div className="promo-heading">
              <span className="blue-line" />
              <h1>New Collection</h1>
            </div>
            <h2>Explore The World of Advanced Handwear</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur elit adipiscing. Donec
              semper diam nisl, a pharetra scelerisqu nibh quis. Ante ipsum
              vestibulum.
            </p>
            <button className="blue-button">Shop Now</button>
          </div>
        </div>
        {/* END OF FIRST PROMOTION SECTION */}
        {/* SMARTWATCH SECTION */}
        <div className="product-section" id="product-section-smartwatch">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">Smartwatch</span>
              </div>
              <h1>New Handwear Collection</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="smartwatch"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/01.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Floss Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/02.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Water Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/03.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Peach Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/04.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Bear Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/05.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Beige Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/06.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Creamy Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/07.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Navy Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/08.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Coal Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/09.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Arctic Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/10.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Blush Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/11.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Stony Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/smartwatch/12.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Grassy Smartwatch</h1>
                  <p>$99.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="smartwatch"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF SMARTWATCH COLLECTION */}
        {/* MOBILE PHONE SECTION */}
        <div className="product-section" id="product-section-mobile">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">Mobile</span>
              </div>
              <h1>Discover Our Mobiles</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="mobile"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/01.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sandy Phone</h1>
                  <p>$135.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/02.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Candyfloss Phone</h1>
                  <p>$129.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/03.png"
                    alt="Skyblue Phone"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Skyblue Phone</h1>
                  <p>$149.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/04.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Mauve Phone</h1>
                  <p>$189.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/05.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Minty Phone</h1>
                  <p>$100.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/06.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sunrise Phone</h1>
                  <p>$91.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/07.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sunset Phone</h1>
                  <p>$155.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/08.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Nightsky Phone</h1>
                  <p>$110.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/09.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Icecream Phone</h1>
                  <p>$125.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/10.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Vanilla Phone</h1>
                  <p>$98.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/11.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Snowfall Phone</h1>
                  <p>$145.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/mobile/12.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Pitbull Phone</h1>
                  <p>$139.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="mobile"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF MOBILE PHONES COLLECTION */}
        {/* SECOND PROMOTION SECTION */}
        <div className="promotion-section">
          <div className="promo-image-container">
            <img
              src="images/product-page/featured-categories/MOBILE.png"
              alt="Collection of Mobile Phones"
            />
          </div>
          <div className="promo-text-container">
            <div className="promo-heading">
              <span className="blue-line" />
              <h1>Summer Collection</h1>
            </div>
            <h2>
              Relish The Flavour <br />
              Of Fresh Warmth
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur elit adipiscing. Donec
              semper diam nisl, a pharetra scelerisqu nibh quis. Ante ipsum
              vestibulum.
            </p>
            <button className="blue-button">Shop Now</button>
          </div>
        </div>
        {/* END OF SECOND PROMOTION SECTION */}
        {/* TABLET SECTION */}
        <div className="product-section" id="product-section-tablet">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">Tablet</span>
              </div>
              <h1>Explore Our Tablets</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="tablet"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/01.png"
                    alt="Lead Tablet"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Lead Tablet</h1>
                  <p>$120.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/02.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sandy Tablet</h1>
                  <p>$119.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/03.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Lilac Tablet</h1>
                  <p>$135.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/04.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Natural Tablet</h1>
                  <p>$109.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/05.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Navy Tablet</h1>
                  <p>$114.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/06.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Silver Tablet</h1>
                  <p>$139.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/07.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Candy Tablet</h1>
                  <p>$121.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/08.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Skyblue Tablet</h1>
                  <p>$142.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/09.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Mint Tablet</h1>
                  <p>$110.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/10.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Lead Tablet</h1>
                  <p>$139.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/11.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Creamy Tablet</h1>
                  <p>$120.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/tablet/12.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>River Tablet</h1>
                  <p>$156.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="tablet"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF TABLET COLLECTION */}
        {/* LAPTOP SECTION */}
        <div className="product-section" id="product-section-laptop">
          <div className="product-section-top-container">
            <div className="section-category-container">
              <div className="section-category-type">
                <span className="blue-line" />
                <span className="section-category-text">Laptop</span>
              </div>
              <h1>Browse Through Our Laptops</h1>
            </div>
            <div
              className="slideshow-buttons-container top"
              data-slideshow="laptop"
            >
              <button className="slideshow-button prev-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
              <button className="slideshow-button next-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="30px"
                  height="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#414141"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="product-cards-container">
            <ul>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/01.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Sapphire Laptop</h1>
                  <p>$209.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/02.png"
                    alt="Fire Orange Laptop"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Fire Laptop</h1>
                  <p>$219.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/03.png"
                    alt="Turquoise Laptop"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Turquoise Laptop</h1>
                  <p>$249.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/04.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Smokey Laptop</h1>
                  <p>$264.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/05.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Harmony Laptop</h1>
                  <p>$237.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/06.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Chromatic Laptop</h1>
                  <p>$199.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/07.png"
                    alt="Mosaic Laptop"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Mosaic Laptop</h1>
                  <p>$215.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/08.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Splash Laptop</h1>
                  <p>$228.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/09.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Grenade Laptop</h1>
                  <p>$242.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/10.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Gleam Laptop</h1>
                  <p>$278.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/11.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Coral Laptop</h1>
                  <p>$255.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
              <li className="product-card">
                <div className="product-image-container">
                  <img
                    src="images/product-page/laptop/12.png"
                    alt="Product 1"
                  />
                  <button className="heart-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="22px"
                      height="22px"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="product-text-container">
                  <h1>Medley Laptop</h1>
                  <p>$286.99</p>
                  <button className="blue-button">Add To Cart</button>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="slideshow-buttons-container bottom"
            data-slideshow="laptop"
          >
            <button className="slideshow-button prev-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <button className="slideshow-button next-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#414141"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* END OF LAPTOP COLLECTION */}
        {/* END OF PRODUCT SECTIONS */}
      </div>
    </>
  );
};

export default ProductPage;
