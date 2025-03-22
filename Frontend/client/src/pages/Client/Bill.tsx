import React, { useEffect, useState } from "react";
import { getDetailOrder, Order } from "../../services/order"; // Correct import for getDetailOrder.

const Bill = () => {
  const [order, setOrder] = useState<Order | null>(null); // To store the fetched order.
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // To show loading while fetching data.

  useEffect(() => {
    // Get the orderId from URL (assumed to be passed in the route)
    const orderId = window.location.pathname.split('/').pop(); // Assuming orderId is in URL

    if (orderId) {
      fetchOrderDetail(orderId);
    } else {
      setError("Order ID not found.");
      setLoading(false);
    }
  }, []);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      const { data } = await getDetailOrder(orderId); // Fetching order details.
      setOrder(data.order); // Setting order details into state.
    } catch (error) {
      setError("Error fetching order details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>No order found.</div>;
  }

  return (
    <div className="container mt-4">
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/profile">Tài khoản</a></li>
                <li><a href="/history">Lịch sử đơn hàng</a></li>
                <li className="active">Chi tiết đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            Mã đơn hàng: <span className="fw-bold">{order.orderId}</span>
          </h5>
          <p className="text-muted">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {/* Product List Table */}
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((cart, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      {cart.productId &&
                        cart.productId.images &&
                        cart.productId.images[0] && (
                          <img
                            src={cart.productId.images[0]}
                            alt="Sản phẩm"
                            width={50}
                          />
                        )}
                    </td>
                    <td>{cart.productId ? cart.productId.name : "N/A"}</td>
                    <td>{cart.productId ? formatPrice(cart.salePrice) : "0 VND"}</td>
                    <td>{cart.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h4 className="mt-3">
            Tổng tiền:{" "}
            <span className="text-danger fw-bold">
              {formatPrice(order.totalAmount)} VNĐ
            </span>
          </h4>

          {/* Shipping Address */}
          <div className="mt-3">
            <p className="mb-1">
              Tên khách hàng: <strong>{order.userName}</strong>
            </p>
            <p className="mb-1">Email: {order.userEmail}</p>
            <p className="mb-1">Sdt: {order.userPhone}</p>
            <p className="mb-1">
              Địa chỉ giao hàng: {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </p>
          </div>

          {/* Order Status */}
          <p className="mt-3">
            <span className="fw-bold">Trạng thái đơn hàng:</span>{" "}
            {order.status}
          </p>
          <p>
            <span className="fw-bold">Phương thức thanh toán:</span>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <span className="fw-bold">Trạng thái thanh toán:</span>{" "}
            {order.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bill;
