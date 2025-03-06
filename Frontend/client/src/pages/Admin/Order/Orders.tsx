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
    <div className="container mt-4">
      <div className="table">
        <table className="table table-hover table-bordered">
          <thead className="table-primary">
            <tr>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Product</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Ten kh</th>
              <th scope="col">Email</th>
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
                <td>
                  {order.orderItems.map((cart) => (
                    <tr>
                      <td>{cart.productId.images && (
                                            <img src={cart.productId.images[0]} alt="" width={50} />
                                        )}</td>
                      <td>{cart.productId.name}</td>
                      <td>{formatPrice(cart.productId.price)}</td>
                      <td>{cart.quantity}</td>
                    </tr>
                  ))}
                </td>
                <td>{formatPrice(order.totalPrice)}</td>
                <td>{order.userId.userName}</td>
                <td>{order.userId.email}</td>
                <td>
                  {order.shippingAddress.address}, {order.shippingAddress.ward},{" "}
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
