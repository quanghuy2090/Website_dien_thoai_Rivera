import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const ShipperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/orders/shipper/${user.id}`) // API lấy đơn hàng của shipper
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.id]);

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
                  <td>
                    <Link
                      to={`/shipper/orders/${order.orderId}`} // Link đến chi tiết đơn hàng của shipper
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

export default ShipperOrders;
