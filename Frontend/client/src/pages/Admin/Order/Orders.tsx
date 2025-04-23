import { useEffect, useState } from "react";
import { getAllOrder } from "../../../services/order";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

interface OrderResponse {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: any[];
  totalAmount: number;
  shippingAddress: any;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  cancelReason?: string;
  cancelledBy?: string;
  cancelHistory?: any[];
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  completedAt?: Date;
}

const Orders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrder();
      if (data.orders) {
        // Sort orders by createdAt date in ascending order (oldest to newest)
        const sortedOrders = data.orders.sort(
          (a: OrderResponse, b: OrderResponse) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách đơn hàng</h5>
            <span className="text-primary">Bảng / Đơn hàng</span>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Stt</th>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Trạng thái đơn hàng</th>
                <th scope="col">Phương thức thanh toán</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.orderId}>
                  <th>{index + 1}</th>
                  <td>{order.orderId}</td>
                  <td>{order.userName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <Link
                      to={`/admin/order/${order.orderId}`}
                      className="btn btn-info"
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
    </div>
  );
};

export default Orders;
