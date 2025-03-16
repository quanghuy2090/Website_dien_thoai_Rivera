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
      {/* /BREADCRUMB */}
      <div className="cart-container">
        {/* 🛒 Cart Header */}
        {/* <div className="cart-header">
        <h2>🛒 Giỏ hàng của bạn</h2>
      </div> */}

        {/* 📋 Cart Table */}
        <div className="cart-table-container">
          {carts.length > 0 ? (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá gốc</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Hủy</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((item, index) => (
                  <tr key={index}>
                    <td className="product-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-product-image"
                      />
                      <div>
                        <strong>{item.name}</strong>
                        <p>
                          {item.variants.color} / {item.variants.capacity}
                        </p>
                      </div>
                    </td>
                    <td>{formatPrice(item.variants.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.subtotal)}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống! 🛒</p>
              <Link to="/" className="continue-shopping">
                Tiếp tục mua sắm
              </Link>
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
    </>
  );
};

export default Cart;
