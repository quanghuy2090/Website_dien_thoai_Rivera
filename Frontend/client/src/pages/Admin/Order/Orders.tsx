import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useAdminOrderPolling } from "../../../hooks/useAdminOrderPolling";

const Orders = () => {
  const { orders, loading } = useAdminOrderPolling();

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
