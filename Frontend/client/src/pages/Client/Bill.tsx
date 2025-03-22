import React, { useEffect, useState } from "react";
import { getDetailOrder, Order } from "../../services/order"; // Correct import for getDetailOrder.

const Bill = () => {
  const [order, setOrder] = useState<Order | null>(null); // To store the fetched order.
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // To show loading while fetching data.

  useEffect(() => {
    const orderId = window.location.pathname.split("/").pop(); // Assuming orderId is in URL

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
    return <div className="text-center text-primary">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  if (!order) {
    return <div className="text-center">No order found.</div>;
  }

  return (
    <div className="container mt-5">
      <div id="breadcrumb" className="section mb-4">
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

      <div className="card mb-4 shadow-lg rounded-3">
        <div className="card-body">
          <h5 className="card-title text-center text-primary mb-3">
            Mã đơn hàng: <span className="fw-bold">{order.orderId}</span>
          </h5>
          <p className="text-muted text-center">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {/* Product List Table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped">
              <thead className="table-primary">
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
                              className="rounded"
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
          </div>

          {/* Total Amount */}
          <h4 className="mt-3 text-center text-primary">
            Tổng tiền: <span className="fw-bold">{formatPrice(order.totalAmount)} VNĐ</span>
          </h4>

          {/* Shipping Address */}
          <div className="mt-4">
            <h6 className="fw-bold text-secondary">Thông tin giao hàng</h6>
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
          <div className="mt-4">
            <p className="text-muted">
              <span className="fw-bold">Trạng thái đơn hàng:</span> {order.status}
            </p>
            <p className="text-muted">
              <span className="fw-bold">Phương thức thanh toán:</span> {order.paymentMethod}
            </p>
            <p className="text-muted">
              <span className="fw-bold">Trạng thái thanh toán:</span> {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
