import React, { useEffect, useState } from "react";
import { getProductById, Product } from "../services/product";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const [mainImage, setMainImage] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      toast.success("Product id Successfully");
      setProduct(data.data);
      setRelatedProducts(data.relatedProducts)
      setMainImage(data.data.images[0]);
    })();
  }, [id]);


  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 150 }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Chi tiết sản phẩm
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Trang chủ</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Chi tiết</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      {/* Shop Detail Start */}
      <div className="container-fluid py-5">
        <div className="row px-xl-5">
          <div className="col-lg-5 pb-5">
            <div className="product-images">
              <div className="thumbnail-images">
                {product?.images.map((img, index) => (
                  <div
                    key={index}
                    className={`${img === mainImage}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${index + 1}`} />
                  </div>
                ))}
              </div>

              <div className="main-image">
                <img src={mainImage!} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-7 pb-5">
            <h3 className="font-weight-semi-bold text-primary">
              {product?.name}
            </h3>
            {/* <div className="d-flex mb-3">
        <div className="text-primary mr-2">
          <small className="fas fa-star" />
          <small className="fas fa-star" />
          <small className="fas fa-star" />
          <small className="fas fa-star-half-alt" />
          <small className="far fa-star" />
        </div>
        <small className="pt-1">(50 Reviews)</small>
      </div> */}
            <h3 className="font-weight-semi-bold mb-4 ">
              {product?.price} VND
            </h3>
            {/* <p className="mb-4">
        Volup erat ipsum diam elitr rebum et dolor. Est nonumy elitr erat
        diam stet sit clita ea. Sanc invidunt ipsum et, labore clita lorem
        magna lorem ut. Erat lorem duo dolor no sea nonumy. Accus labore
        stet, est lorem sit diam sea et justo, amet at lorem et eirmod ipsum
        diam et rebum kasd rebum.
      </p> */}
            <div className="d-flex mb-3">
              <p className="text-dark font-weight-medium mb-0 mr-3">Dung lượng</p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="size-1" name="size" />
                  <label className="custom-control-label" htmlFor="size-1">256GB</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="size-2" name="size" />
                  <label className="custom-control-label" htmlFor="size-2">512GB</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="size-3" name="size" />
                  <label className="custom-control-label" htmlFor="size-3">1TB</label>
                </div>
              </form>
            </div>
            <div className="d-flex mb-4">
              <p className="text-dark font-weight-medium mb-0 mr-3">Màu sắc:</p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="color-1" name="color" />
                  <label className="custom-control-label" htmlFor="color-1">Đen</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="color-2" name="color" />
                  <label className="custom-control-label" htmlFor="color-2">Trắng</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" className="custom-control-input" id="color-3" name="color" />
                  <label className="custom-control-label" htmlFor="color-3">Đỏ</label>
                </div>
              </form>
            </div>
            <div className="d-flex align-items-center mb-4 pt-2">
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
              <button className="btn btn-primary px-3">
                <i className="fa fa-shopping-cart mr-1" /> Thêm giỏ hàng
              </button>
            </div>
            {/* <div className="d-flex pt-2">
        <p className="text-dark font-weight-medium mb-0 mr-2">Share on:</p>
        <div className="d-inline-flex">
          <a className="text-dark px-2" href="">
            <i className="fab fa-facebook-f" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-twitter" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-linkedin-in" />
          </a>
          <a className="text-dark px-2" href="">
            <i className="fab fa-pinterest" />
          </a>
        </div>
      </div> */}
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="nav nav-tabs justify-content-center border-secondary mb-4">
              <a
                className="nav-item nav-link active"
                data-toggle="tab"
                href="#tab-pane-1"
              >
                Giới thiệu
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-2"
              >
                Thông tin sản phẩm
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-3"
              >
                Đánh giá (0)
              </a>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="tab-pane-1">
                <p>{product?.description}</p>
              </div>
              <div className="tab-pane fade" id="tab-pane-2">
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
              <div className="tab-pane fade" id="tab-pane-3">
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
                  <div className="col-md-6">
                    <h4 className="mb-4">Leave a review</h4>
                    <small>
                      Your email address will not be published. Required fields
                      are marked *
                    </small>
                    <div className="d-flex my-3">
                      <p className="mb-0 mr-2">Your Rating * :</p>
                      <div className="text-primary">
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                        <i className="far fa-star" />
                      </div>
                    </div>
                    <form>
                      <div className="form-group">
                        <label htmlFor="message">Your Review *</label>
                        <textarea
                          id="message"
                          cols={30}
                          rows={5}
                          className="form-control"
                          defaultValue={""}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input type="text" className="form-control" id="name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                        />
                      </div>
                      <div className="form-group mb-0">
                        <input
                          type="submit"
                          defaultValue="Leave Your Review"
                          className="btn btn-primary px-3"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Shop Detail End */}
      {/* Products Start */}
      <div className="container-fluid py-5">
        <div className="text-center mb-4">
          <h2 className="section-title px-5">
            <span className="px-2">You May Also Like</span>
          </h2>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="owl-carousel related-carousel">
              {relatedProducts.map((item) => (
                <div key={item._id} className="col-lg-3 col-md-6 col-sm-12 pb-1">
                  <div className="card product-item border-0 mb-4">
                    <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                      <img
                        className="img-fluid"
                        src={item.images[0]}
                        alt={item.name}
                      />
                    </div>
                    <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                      <Link to={`/product/${item._id}`}>
                        <h6 className="text-truncate mb-3">{item.name}</h6>
                      </Link>
                      <div className="d-flex justify-content-center">
                        <h6>${item.price}</h6>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between bg-light border">
                      <button
                        className="btn btn-sm text-dark p-0"

                      >
                        <i className="fas fa-shopping-cart text-primary mr-1" />
                        Thêm giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>



    </>
  );
};

export default ProductDetail;
