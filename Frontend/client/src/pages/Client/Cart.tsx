import React, { useEffect, useState } from "react";
import {
  CartItem,
  deleteAllCart,
  deleteCart,
  getCart,
  updateCart,
} from "../../services/cart";
import { Link } from "react-router-dom";
import "../../css/style.css";
import toast from "react-hot-toast";

const Cart = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  console.log(userId);
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
      console.log(data.cart.items);
      if (data.cart && data.cart.items) {
        // Kiểm tra đúng key
        setCarts(data.cart.items);
        setTotalAmount(data.cart.totalSalePrice || 0); // Cập nhật đúng giá trị tổng
      }
    } catch (error) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
    }
  };
  const handleDeleteCartItem = async (productId: string, variantId: string) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      try {
        await deleteCart(productId, variantId);

        // Cập nhật giỏ hàng sau khi xóa
        const updatedCart = carts.filter(
          (cart) =>
            !(cart.productId._id === productId && cart.variantId === variantId)
        );

        setCarts(updatedCart);

        // Kiểm tra xem updatedCart có sản phẩm nào không
        if (updatedCart.length === 0) {
          setTotalAmount(0);
        } else {
          // Tính lại tổng giá
          const newTotalPrice = updatedCart.reduce(
            (sum, item) => sum + item.quantity * item.salePrice,
            0
          );
          setTotalAmount(newTotalPrice);
        }

        toast.success("Xóa thành công!");
      } catch (error) {
        console.log(error);
        toast.error("Xóa thất bại!");
      }
    }
  };
  const handleRemoveAllCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      try {
        await deleteAllCart(); // Gọi API xóa toàn bộ giỏ hàng

        setCarts([]); // Cập nhật lại giỏ hàng rỗng
        setTotalAmount(0); // Đặt tổng giá về 0

        toast.success("Đã xóa toàn bộ giỏ hàng!");
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi xóa giỏ hàng!");
      }
    }
  };
  const handleUpdateQuantity = async (
    productId: string,
    variantId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      toast.error("Số lượng không được nhỏ hơn 1!");
      return;
    }

    try {
      const { data } = await updateCart(productId, variantId, newQuantity);

      // Cập nhật lại giỏ hàng sau khi thay đổi số lượng
      const updatedCart = carts.map((cart) =>
        cart.productId._id === productId && cart.variantId === variantId
          ? {
              ...cart,
              quantity: newQuantity,
              salePrice:
                data.cart.items.find(
                  (i: CartItem) =>
                    i.productId._id === productId && i.variantId === variantId
                )?.salePrice || cart.salePrice,
              subtotal:
                newQuantity *
                (data.cart.items.find(
                  (i: CartItem) =>
                    i.productId._id === productId && i.variantId === variantId
                )?.salePrice || cart.salePrice),
            }
          : cart
      );

      setCarts(updatedCart);

      // Cập nhật tổng tiền
      setTotalAmount(data.cart.totalSalePrice);

      toast.success("Cập nhật số lượng thành công!");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi cập nhật số lượng!");
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
      {/* /BREADCRUMB */}
      <div className="cart-container">
        {/* 🛒 Cart Header */}
        {/* <div className="cart-header">
        <h2>🛒 Giỏ hàng của bạn</h2>
      </div> */}

        {/* 📋 Cart Table */}
        <div className="cart-table-container">
          {carts.length > 0 ? (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Hủy</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => {
                    return (
                      <tr>
                        <td>
                          <img src={cart.productId.images} alt="" width={100} />
                          <Link className="cart-product-name" to={`/product/${cart.productId._id}`}>
                            {cart.productId.name}
                          </Link>
                          <br />
                          {cart.color}/{cart.capacity}
                        </td>
                        <td>
                          {formatPrice(cart.salePrice)}
                          <br />
                          {cart?.salePrice !== cart?.price && (
                            <del className="product-old-price h6">
                              {formatPrice(cart.price)}
                            </del>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary px-3"
                            onClick={() =>
                              handleUpdateQuantity(
                                cart.productId._id,
                                cart.variantId,
                                cart.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-3 fw-bold">{cart.quantity}</span>
                          <button
                            className="btn btn-primary px-3"
                            onClick={() =>
                              handleUpdateQuantity(
                                cart.productId._id,
                                cart.variantId,
                                cart.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </td>

                        <td>{formatPrice(cart.quantity * cart.salePrice)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              handleDeleteCartItem(
                                cart.productId._id,
                                cart.variantId
                              )
                            }
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="delete-all-container">
                <button
                  className="delete-all-btn"
                  onClick={handleRemoveAllCart}
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống! 🛒</p>
              <Link to="/" className="continue-shopping">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>

        {/* 💰 Cart Summary */}
        <div className="cart-summary">
          <h3>Tổng tiền: {formatPrice(totalAmount)}</h3>
          <Link to="/checkout" className="checkout-btn">
            🛍 Thanh toán ngay
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
