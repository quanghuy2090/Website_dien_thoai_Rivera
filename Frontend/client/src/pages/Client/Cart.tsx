import React, { useEffect, useState } from "react";
import { Carts, deleteAllCart, deleteCart, getCart } from "../../services/cart";
import { Link } from "react-router-dom";
import "../../css/style.css";

const Cart = () => {
  const [carts, setCarts] = useState<Carts[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id);
          fetchCart();
        }
      } catch (error) {
        console.error("Lỗi khi parse user data:", error);
      }
    }
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      if (data.data && data.data.items) {
        setCarts(data.data.items);
        setTotalAmount(data.data.total || 0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      if (window.confirm("Xoá sản phẩm này khỏi giỏ hàng?")) {
        await deleteCart(productId);
        setCarts((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        // Update total price
        setTotalAmount(
          (prevTotal) =>
            prevTotal -
              carts.find((item) => item.productId === productId)?.subtotal || 0
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const deleteAll = async (_id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá toàn bộ giỏ hàng?")) {
      await deleteAllCart(_id);
      setCarts([]);
      setTotalAmount(0);
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return "0 VND";
    return price.toLocaleString("vi-VN") + " VND";
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
                <li className="active">Giỏ hàng</li>
              </ul>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* Page Header End */}
      {/* Cart Start */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-secondary text-dark">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá gốc</th>
                  <th>Số lượng</th>
                  <th>Thành giá</th>
                  <th>Hủy</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {carts.map((item) => (
                  <tr>
                    <td className="align-middle">
                      {item.productId?.images && (
                        <img src={item.productId.images[0]} alt="" width={50} />
                      )}
                      <Link className="table align-middle" to={`/product/${item.productId._id}`}>{item.productId?.name}</Link>
                    </td>
                    <td className="align-middle">
                      {formatPrice(item.productId?.price)}
                    </td>
                    <td className="align-middle">
                      <div
                        className="input-group quantity mx-auto"
                        style={{ width: 100 }}
                      >
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-minus"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, -1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <i className="fa fa-minus" />
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-secondary text-center"
                          value={item.quantity}
                        />
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-plus"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, 1)
                            }
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      {formatPrice(item.productId.price * item.quantity)}
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => removeCart(item.productId._id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4">
            {/* <form className="mb-5" action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control p-4"
                  placeholder="Coupon Code"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary">Apply Coupon</button>
                </div>
              </div>
            </form> */}
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">Tổng quan</h4>
              </div>
              {/* <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">$150</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$10</h6>
                </div>
              </div> */}
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Tổng</h5>
                  <h5 className="font-weight-bold">
                    {formatPrice(totalAmount)}
                  </h5>
                </div>
                <Link
                  to={`/checkout`}
                  className="btn btn-block btn-primary my-3 py-3"
                >
                  Thanh Toán
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="delete-all-container">
          <button
            className="delete-all-btn"
            onClick={() => deleteAll(carts._id)}
          >
            🗑 Xóa tất cả
          </button>
        </div>
        {/* 💰 Cart Summary */}
        <div className="cart-summary">
          <h3>Tổng tiền: {formatPrice(totalAmount)}</h3>
          <Link to="/checkout" className="checkout-btn">
            🛍 Thanh toán ngay
          </Link>
        </div>
      </div>
      {/* Cart End */}
    </div>
  );
};

export default Cart;
