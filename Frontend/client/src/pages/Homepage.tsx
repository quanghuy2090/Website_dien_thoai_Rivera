import { useEffect, useState } from "react";
import { getAllProduct, Product } from "../services/product";
import { addCart, Carts } from "../services/cart";
import toast from "react-hot-toast";
// import { Footer } from "../components/Footer";
import { Carousel } from "../components/Carousel";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(4);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProduct();
      setProducts(res.data.data);
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);
  const addToCart = async (product: Product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!", {});
        nav("/login");
      }
      const cart: Carts = {
        _id: "", // Backend tự tạo `_id`
        userId: user._id, // Chỉ lấy `_id` của user
        quantity: 1,
        productId: product._id, // Đảm bảo có productId
      };
      // 🛠 Gửi request thêm vào giỏ hàng
      const { data } = await addCart(cart);

      // 🎉 Hiển thị thông báo thành công
      toast.success("Cart added successfully");

      console.log(" Thêm vào giỏ hàng:", data);
    } catch (error) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Error");
    }
  };

  return (
    <>
      <Carousel />
      {/* Featured Start */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3 text-center">
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: 30 }}
            >
              <h1 className="fa fa-check text-primary m-0 mr-3" />
              <h5 className="font-weight-semi-bold m-0">
                Sản phẩm chất lượng cao
              </h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: 30 }}
            >
              <h1 className="fa fa-shipping-fast text-primary m-0 mr-2" />
              <h5 className="font-weight-semi-bold m-0">Miễn phí vận chuyển</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: 30 }}
            >
              <h1 className="fas fa-exchange-alt text-primary m-0 mr-3" />
              <h5 className="font-weight-semi-bold m-0">
                Hoàn trả trong 14 ngày
              </h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: 30 }}
            >
              <h1 className="fa fa-phone-volume text-primary m-0 mr-3" />
              <h5 className="font-weight-semi-bold m-0">Hỗ trợ 24/7</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Start */}
      {/* <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
          <div className="col-lg-4 col-md-6 pb-1">
            <div
              className="cat-item d-flex flex-column border mb-4"
              style={{ padding: 30 }}
            >
              <p className="text-right">15 Products</p>
              <a
                href="#"
                className="cat-img position-relative overflow-hidden mb-3"
              >
                <img
                  className="img-fluid"
                  src="img/cat-1.jpg"
                  alt="Category 1"
                />
              </a>
              <h5 className="font-weight-semi-bold m-0">Women's Dresses</h5>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 pb-1">
            <div
              className="cat-item d-flex flex-column border mb-4"
              style={{ padding: 30 }}
            >
              <p className="text-right">10 Products</p>
              <a
                href="#"
                className="cat-img position-relative overflow-hidden mb-3"
              >
                <img
                  className="img-fluid"
                  src="img/cat-2.jpg"
                  alt="Category 2"
                />
              </a>
              <h5 className="font-weight-semi-bold m-0">Men's Fashion</h5>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 pb-1">
            <div
              className="cat-item d-flex flex-column border mb-4"
              style={{ padding: 30 }}
            >
              <p className="text-right">8 Products</p>
              <a
                href="#"
                className="cat-img position-relative overflow-hidden mb-3"
              >
                <img
                  className="img-fluid"
                  src="img/cat-3.jpg"
                  alt="Category 3"
                />
              </a>
              <h5 className="font-weight-semi-bold m-0">Kids' Clothes</h5>
            </div>
          </div>
        </div>
      </div> */}
      {/* Categories End */}

      {/* Products Start */}
      <div className="container-fluid pt-5">
        <div className="text-center mb-4">
          <h2 className="section-title px-5">
            <span className="px-2">Sản phẩm bán chạy</span>
          </h2>
        </div>
        <div className="row px-xl-5 pb-3">
          {currentProducts.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div className="card product-item border-0 mb-4">
                <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                  <img
                    className="img-fluid"
                    src={product.images[0]}
                    alt={product.name}
                  />
                </div>
                <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                  <Link to={`/product/${product._id}`}>
                    <h6 className="text-truncate mb-3">{product.name}</h6>
                  </Link>
                  <div className="d-flex justify-content-center">
                    <h6>${product.price}</h6>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between bg-light border">
                  <button
                    className="btn btn-sm text-dark p-0"
                    onClick={() => addToCart(product)}
                  >
                    <i className="fas fa-shopping-cart text-primary mr-1" />
                    Thêm giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            «
          </button>
          <span className="mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-primary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            »
          </button>
        </div>
      </div>
      {/* Products End */}
    </>
  );
};

export default HomePage;
