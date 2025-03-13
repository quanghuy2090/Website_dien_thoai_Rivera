import { useEffect, useState } from "react";
import { getAllOrder, Order } from "../../../services/order";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
const Orders = () => {
  const [order, setOrder] = useState<Order[]>([]);
  console.log(order);
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const { data } = await getAllOrder();
    setOrder(data.orders);
  };

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };
  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-cart-plus me-2"></i> Quản lý Đơn hàng
      </h1>
      <p className="mb-4 text-secondary">
        Đây là danh sách các đơn hàng. Bạn có thể kiểm tra trạng thái, cập nhật thông tin vận chuyển hoặc hủy đơn hàng nếu cần.
      </p>

      <div className="table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Product</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Ten kh</th>
              <th scope="col">Email</th>
              <th scope="col">Sđt</th>
              <th scope="col">Địa chỉ giao hàng</th>
              <th scope="col">Trạng thái đơn hàng</th>
              <th scope="col">Phương thức thanh toán</th>
              <th scope="col">Trạng thái thanh toán</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {order.map((order) => (
              <tr>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <table className="table table-bordered border-primary">
                  <thead>
                    <tr>
                      <th scope="col">Hình Ảnh</th>
                      <th scope="col">Tên Sản Phẩm</th>
                      <th scope="col">Giá</th>
                      <th scope="col">Số Lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((cart, index) => (
                      <tr key={index} className="align-middle text-center">
                        <td>
                          {cart.productId.images && (
                            <img src={cart.productId.images[0]} alt="" width={50} className="rounded" />
                          )}
                        </td>
                        <td className="text-start fw-semibold">{cart.productId.name}</td>
                        <td>{formatPrice(cart.productId.price)}</td>
                        <td>{cart.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <td>{formatPrice(order.totalPrice)}</td>
                <td>{order.userId.userName}</td>
                <td>{order.userId.email}</td>
                <td>{order.userId.phone}</td>
                <td>
                  {order.userId.address}, {order.shippingAddress.ward},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </td>
                <td>{order.orderStatus}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="btn btn-warning"
                  >
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
