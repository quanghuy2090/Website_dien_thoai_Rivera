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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
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
      if (data.cart && data.cart.items) {
        setCarts(data.cart.items);
        setTotalAmount(data.cart.totalSalePrice || 0);
      }
    } catch (error: any) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tải giỏ hàng");
    }
  };

  const handleDeleteCartItem = async (productId: string, variantId: string) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      try {
        const { data } = await deleteCart(productId, variantId);
        const updatedCart = carts.filter(
          (cart) =>
            !(cart.productId._id === productId && cart.variantId === variantId)
        );
        setCarts(updatedCart);
        if (updatedCart.length === 0) {
          setTotalAmount(0);
        } else {
          const newTotalPrice = updatedCart.reduce(
            (sum, item) => sum + item.quantity * item.salePrice,
            0
          );
          setTotalAmount(newTotalPrice);
        }
        toast.success(data.message || "Xóa thành công!");
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "Xóa thất bại!");
      }
    }
  };

  const handleRemoveAllCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      try {
        const { data } = await deleteAllCart();
        setCarts([]);
        setTotalAmount(0);
        toast.success(data.message || "Đã xóa toàn bộ giỏ hàng!");
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "Lỗi khi xóa giỏ hàng!");
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
      setTotalAmount(data.cart.totalSalePrice);
      toast.success(data.message || "Cập nhật số lượng thành công!");
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật số lượng!"
      );
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return "0 VND";
    return price.toLocaleString("vi-VN") + " VND";
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ hàng của bạn</h2>
      </div>

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
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart) => (
                  <tr key={`${cart.productId._id}-${cart.variantId}`}>
                    <td>
                      <div className="cart-product-info">
                        <img
                          src={cart.productId.images[0]}
                          alt={cart.productId.name}
                          className="cart-product-image"
                        />
                        <div>
                          <Link
                            className="cart-product-name"
                            to={`/product/${cart.productId._id}`}
                          >
                            {cart.productId.name}
                          </Link>
                          <div className="cart-product-variant">
                            {cart.color} / {cart.capacity}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-price">
                        <span className="product-sale-price">
                          {formatPrice(cart.salePrice)}
                        </span>
                        {cart?.salePrice !== cart?.price && (
                          <span className="product-old-price">
                            {formatPrice(cart.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
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
                        <input
                          type="text"
                          className="quantity-input"
                          value={cart.quantity}
                          readOnly
                        />
                        <button
                          className="quantity-btn"
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
                      </div>
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
                ))}
              </tbody>
            </table>
            <div className="delete-all-container">
              <button className="delete-all-btn" onClick={handleRemoveAllCart}>
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

      {carts.length > 0 && (
        <div className="cart-summary">
          <h3>Tổng tiền: {formatPrice(totalAmount)}</h3>
          <Link to="/checkout" className="checkout-btn">
            Thanh toán ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
