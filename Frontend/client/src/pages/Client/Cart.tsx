import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../css/style.css";
import { CartContext } from "../../context/CartContext";
import { useCartPolling } from "../../hooks/useCartPolling";

const Cart = () => {
  const { state, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  const { items: carts, totalQuantity } = state;
  const { hasBannedProduct } = useCartPolling();

  const handleDeleteCartItem = (productId: string, variantId: string) => {
    removeFromCart(productId, variantId);
  };

  const handleRemoveAllCart = () => {
    if (carts.length === 0) {
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      clearCart();
    }
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > 100) {
      return;
    }

    updateQuantity(productId, variantId, newQuantity);
  };

  const formatPrice = (price: number) => {
    if (!price) return "0 VND";
    return price.toLocaleString("vi-VN") + " VND";
  };

  const totalAmount = carts.reduce(
    (sum, item) => sum + item.quantity * item.salePrice,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ hàng của bạn ({totalQuantity} sản phẩm)</h2>
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
                        {cart.salePrice !== cart.price && (
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
          {hasBannedProduct ? (
            <button className="checkout-btn disabled" disabled>
              Không thể thanh toán (sản phẩm bị chặn)
            </button>
          ) : (
            <Link to="/checkout" className="checkout-btn">
              Thanh toán ngay
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
