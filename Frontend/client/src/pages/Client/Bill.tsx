import { useEffect, useState } from "react";
import { getAllOrder, Order } from "../../services/order"; // Make sure the `getAllOrder` function is correct in your services file.

const Bill = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orderUser, setOrderUser] = useState<Order[]>([]);
  useEffect(() => {
    const data = getAllOrder(userId);
    console.log(data);
  },[]);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id); // Store userId in state
          fetchOrder(user._id); // Fetch orders for the logged-in user
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchOrder = async (userId: string) => {
    try {
      const { data } = await getAllOrder(); // Fetching orders from the API

      // Filter orders by userId (in case the API doesn't automatically filter it)
      const filteredOrders = data.orders.filter(
        (order: Order) => order.userId._id === userId
      );
      setOrderUser(filteredOrders); // Set the orders of the logged-in user
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };
  console.log(orderUser);

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Danh sách đơn hàng</h2>
      {orderUser.length === 0 ? (
        <p className="text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orderUser.map((order, index) => (
          <div className="card mb-4 shadow-sm" key={index}>
            <div className="card-body">
              <h5 className="card-title">
                Mã đơn hàng: <span className="fw-bold">{order._id}</span>
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
                  {order.items.map((cart, idx) => (
                    <tr key={idx}>
                      <td>
                        {cart && (
                          <img
                            src={cart.productId.images[0]}
                            alt="Sản phẩm"
                            width={50}
                          />
                        )}
                      </td>
                      <td>{cart.productId.name}</td>
                      <td>{formatPrice(cart.productId.price)}</td>
                      <td>{cart.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h6 className="mt-3">
                Tổng tiền:{" "}
                <span className="text-danger fw-bold">
                  {formatPrice(order.totalAmount)} VNĐ
                </span>
              </h6>

              {/* Shipping Address */}
              <div className="mt-3">
                <h6>Địa chỉ giao hàng:</h6>
                <p className="mb-1">
                  Tên khách hàng: <strong>{order.userId.userName}</strong>
                </p>
                <p className="mb-1">Email: {order.userId.email}</p>
                <p className="mb-1">Sdt: {order.userId.phone}</p>
                <p className="mb-1">
                  {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
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
        ))
      )}
    </div>
  );
};

export default Bill;
